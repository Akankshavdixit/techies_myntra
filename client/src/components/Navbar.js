import { useSession } from '../context/SessionContext';

function Navbar()
{
    const { session } = useSession();
    return <p>{session.username}</p>
}

export default Navbar;