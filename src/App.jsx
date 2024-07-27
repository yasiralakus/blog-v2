import { createContext, useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { supabase } from "./main";
import { BeatLoader } from "react-spinners";

export const UserContext = createContext(null);

export default function App() {

    const [user, setUser] = useState(null);
    const [bigLoading, setBigLoading] = useState(true);
    const location = useLocation();
    const [openNotification, setOpenNotification] = useState(false);
    const [notification, setNotification] = useState(false);

    const [openMobileNav, setOpenMobileNav] = useState(false);

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

    async function handleSubscribe(e) {
        e.preventDefault();
    }

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

    useEffect(() => {
        const timeout = setTimeout(() => {
            setOpenNotification(false);
        }, 3000);

        return () => clearTimeout(timeout);
    }, [openNotification]);

    useEffect(() => {
        setOpenMobileNav(false);
    }, [location.pathname])


    return (
        <div className="full-page">

            <div style={openNotification ? {right: '0'} : {}} className="notification-box">
                <p>{notification}</p>
            </div>

            {
                openMobileNav &&
                <ul className="mobile-nav">
                    <li><Link to={'/'}>Keşfet</Link></li>
                    <div className="small-line"></div>
                    <li><Link to={'/begenilenler'}>Beğenilenler</Link></li>
                    <li><Link to={'/kaydedilenler'}>Kaydedilenler</Link></li>
                    <li><Link to={'/takip-edilen-kullanici-gonderileri'}>Takip ettiklerim</Link></li>
                    <div className="small-line"></div>
                    <li><Link to={'/kategori/siyaset'}>Siyaset</Link></li>
                    <li><Link to={'/kategori/ekonomi'}>Ekonomi</Link></li>
                    <li><Link to={'/kategori/sinema'}>Sinema</Link></li>
                    <li><Link to={'/kategori/spor'}>Spor</Link></li>
                    <li><Link to={'/kategori/yemek'}>Yemek</Link></li>
                    <li><Link to={'/kategori/seyahat'}>Seyahat</Link></li>
                    <li><Link to={'/kategori/teknoloji'}>Teknoloji</Link></li>
                    <div className="small-line"></div>
                    <li><Link to={'/yeni-gonderi'}>Yeni Gönderi</Link></li>
                </ul>
            }

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
                        <li><Link>Keşfet</Link></li>
                        <li><Link>Gönderiler <i className="fa-solid fa-angle-down"></i>
                        <ul>
                            <li><Link to={'/begenilenler'}>Beğenilenler</Link></li>
                            <li><Link to={'/kaydedilenler'}>Kaydedilenler</Link></li>
                            <li><Link to={'/takip-edilen-kullanici-gonderileri'}>Takip ettiklerim</Link></li>
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
                        <li><Link to={'/yeni-gonderi'}>Yeni Gönderi</Link></li>
                    </ul>

                    {
                        user ?
                        <div className="user-box">
                            <Link to={`/profil/${user?.username}`} className="go-profile"><i className="fa-solid fa-user"></i></Link>
                            <button onClick={handleLogout}>Çıkış Yap</button>
                        </div>
                        :
                        <div className="user-box">
                            <Link to={'/giris-yap'}>Giriş Yap</Link>
                        </div>
                    }

                    <button onClick={() => (openMobileNav ? setOpenMobileNav(false) : setOpenMobileNav(true))} className="mobile-nav-button">
                        <span style={openMobileNav ? {transform: 'rotate(45deg) translateX(6px) translateY(3px)'} : {}}></span>
                        <span style={openMobileNav ? {opacity: '0'} : {}}></span>
                        <span style={openMobileNav ? {transform: 'rotate(135deg) translateX(-7px) translateY(6px)'} : {}}></span>
                    </button>

                </div>

            </header>

            <UserContext.Provider value={{user, setUser, setOpenNotification, notification, setNotification}}>
            <Outlet />
            </UserContext.Provider>

        </div>
    )
}