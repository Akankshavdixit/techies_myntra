from flask import Flask, request, jsonify
from flask_cors import CORS
from ml_model import train_model, recommend_posts
import pandas as pd
import os
from neo4j import GraphDatabase
from apscheduler.schedulers.background import BackgroundScheduler
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
CORS(app)

scheduler = BackgroundScheduler()
scheduler.start()
uri = os.getenv("URL")
print(uri)
driver = GraphDatabase.driver(uri, auth=("neo4j", os.getenv("password")))
# Load data


def run_query(query, parameters=None):
    with driver.session() as session:
        result = session.run(query, parameters)
        return result.data()
query = '''
    MATCH (u:User)-[r:LIKES]->(p:Post)
    MATCH (i:User)-[:CREATED]->(p)
    RETURN u.username AS user_id, p.id AS post_id,i.username AS influencer_id,
      p.likes AS post_like_count, p.description AS post_content, 
      p.createdAt AS time_created, p.tags AS post_tags
    ''' 
result=run_query(query, None)
df = pd.DataFrame(result)
# Train the model and get necessary variables
model, user_id_map, post_ids, unique_tags = train_model(df)

def create_ml_model():
    global df
    print("Creating model")
    query = '''
    MATCH (u:User)-[r:LIKES]->(p:Post)
    MATCH (i:User)-[:CREATED]->(p)
    RETURN u.username AS user_id, p.id AS post_id,i.username AS influencer_id,
      p.likes AS post_like_count, p.description AS post_content, 
      p.createdAt AS time_created, p.tags AS post_tags
    ''' 
    result=run_query(query, None)
    df = pd.DataFrame(result)

    # Load data
    global model, user_id_map, post_ids, unique_tags

    # Train the model and get necessary variables
    model, user_id_map, post_ids, unique_tags = train_model(df)

scheduler.add_job(create_ml_model, 'interval', hours=0.25)

# Flask API endpoints
@app.route('/recommend', methods=['GET'])
def recommend():
    user_id = request.args.get('user_id')
    num_recommendations = int(request.args.get('num_recommendations', 5))
    recommended_ids = recommend_posts(model, user_id, user_id_map, post_ids, unique_tags, df, num_recommendations)
    recommendations = []

    with driver.session() as session:
        for post_id in recommended_ids:
            result = session.run("""
                MATCH (p: Post {id: $post_id})<-[:CREATED]-(creator:User)
                OPTIONAL MATCH (u:User {username : $user_id })
                OPTIONAL MATCH (u)-[like: LIKES]->(p)
                OPTIONAL MATCH (u)-[follow:FOLLOWS]->(creator)
                RETURN p,creator,
                CASE WHEN like IS NOT NULL THEN true ELSE false END AS is_liked,
                CASE WHEN follow IS NOT NULL THEN true ELSE false END AS is_following
            """, post_id=post_id, user_id=user_id)

            seen_post_ids = set()
            for record in result:
                post = record['p']
                
                post_id = post['id']
                if post_id in seen_post_ids:
                    continue
                seen_post_ids.add(post_id)
                creator_username = record['creator']['username'] if record['creator'] else None
                is_following = record['is_following']
                is_liked = record['is_liked']

                # Create a new dictionary to store post details and additional attributes
                post_obj = {
                    'createdAt': post['createdAt'].iso_format(),
                    'productLinks':post['productLinks'],
                    'imageUrls':post['imageUrls'],
                    'description': post['description'],
                    'id': post['id'],
                    'likes':post['likes'],
                    'tags':post['tags'],
                    'creator': creator_username,
                    'isFollowed': is_following,
                    'liked': is_liked
                }
                

                recommendations.append(post_obj)



    return jsonify({'user_id': user_id, 'recommendations': recommendations})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
