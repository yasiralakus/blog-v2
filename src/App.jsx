import { Link, Outlet } from "react-router-dom";

export default function App() {


    return (
        <div className="full-page">

            <header className="header">

                <div className="container">

                    <Link className="logo">FİGÜRAN</Link>
                    
                    <ul className="nav">
                        <li><Link>Anasayfa</Link></li>
                        <li><Link>Gönderiler
                        <ul>
                            <li><Link>Beğenilenler</Link></li>
                            <li><Link>Kaydedilenler</Link></li>
                        </ul>
                        </Link></li>
                        <li><Link>Kategoriler
                        <ul>
                            <li><Link>Siyaset</Link></li>
                            <li><Link>Ekonomi</Link></li>
                            <li><Link>Sinema</Link></li>
                            <li><Link>Spor</Link></li>
                            <li><Link>Yemek</Link></li>
                            <li><Link>Seyahat</Link></li>
                        </ul>
                        </Link></li>
                        <li><Link>Yeni Gönderi</Link></li>
                    </ul>

                    <div className="user-box">

                        <Link>Giriş Yap</Link>

                    </div>

                </div>

            </header>

            <Outlet />

            <footer className="footer">
                
            </footer>

        </div>
    )
}