import { createContext, useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { supabase } from "./main";
import { BeatLoader } from "react-spinners";

export const UserContext = createContext(null);

export default function App() {

    const [user, setUser] = useState(null);
    const [bigLoading, setBigLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        async function fetchData() {
            const { data: { user: userData } } = await supabase.auth.getUser();

            if(userData) {
                let { data: profiles, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('user_id', userData.id)

                    setUser(profiles[0]);
            }
        }
        fetchData();
    }, [])

    useEffect(() => {
        window.scrollTo(0,0)
    }, [location.pathname])

    useEffect(() => {
        setBigLoading(true);
        const timer = setTimeout(() => {
            setBigLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, [location.pathname])

    async function handleLogout(e) {
        e.preventDefault();
        let { error } = await supabase.auth.signOut()
        setUser(null);
    }


    return (
        <div className="full-page">

            {
                bigLoading && 

                <div className="big-loading">
                    <div className="icon">
                        <BeatLoader color="#fff" size={20}/>
                    </div>
                </div>
            }

            <header className="header">

                <div className="container">

                    <Link className="logo">FİGÜRAN</Link>
                    
                    <ul className="nav">
                        <li><Link>Anasayfa</Link></li>
                        <li><Link>Gönderiler <i className="fa-solid fa-angle-down"></i>
                        <ul>
                            <li><Link to={'/begenilenler'}>Beğenilenler</Link></li>
                            <li><Link to={'/kaydedilenler'}>Kaydedilenler</Link></li>
                        </ul>
                        </Link></li>
                        <li><Link>Kategoriler <i className="fa-solid fa-angle-down"></i>
                        <ul>
                            <li><Link to={'/kategori/siyaset'}>Siyaset</Link></li>
                            <li><Link to={'/kategori/ekonomi'}>Ekonomi</Link></li>
                            <li><Link to={'/kategori/sinema'}>Sinema</Link></li>
                            <li><Link to={'/kategori/spor'}>Spor</Link></li>
                            <li><Link to={'/kategori/yemek'}>Yemek</Link></li>
                            <li><Link to={'/kategori/seyahat'}>Seyahat</Link></li>
                            <li><Link to={'/kategori/teknoloji'}>Teknoloji</Link></li>
                        </ul>
                        </Link></li>
                        <li><Link>Yeni Gönderi</Link></li>
                    </ul>

                    {
                        user ?
                        <div className="user-box">
                            <Link className="go-profile"><i className="fa-solid fa-user"></i></Link>
                            <button onClick={handleLogout}>Çıkış Yap</button>
                        </div>
                        :
                        <div className="user-box">
                            <Link to={'/giris-yap'}>Giriş Yap</Link>
                        </div>
                    }

                </div>

            </header>

            <UserContext.Provider value={{user, setUser}}>
            <Outlet />
            </UserContext.Provider>

            <footer className="footer">

            </footer>

        </div>
    )
}