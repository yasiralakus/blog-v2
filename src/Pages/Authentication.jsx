import { useNavigate } from "react-router-dom";
import { supabase } from "../main";
import { useContext } from "react";
import { UserContext } from "../App";

export default function Authentication() {

    const {user, setUser} = useContext(UserContext);

    const navigate = useNavigate();

    async function handleSignup(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const formObj = Object.fromEntries(formData);
        
        let { data, error } = await supabase.auth.signUp({
            email: formObj.email,
            password: formObj.password
        })

        if(!error) {
            const { data, error : errProfiles } = await supabase
                .from('profiles')
                .insert([
                {
                    fullname: formObj.fullname,
                    username: formObj.username,
                    email: formObj.email,
                },
                ])
                .select()
                
                if(!errProfiles) {
                    setUser(data[0])
                    navigate('/');
                }

        }
  
    }

    async function handleLogin(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const formObj = Object.fromEntries(formData);
        
        let { data: loginData, error } = await supabase.auth.signInWithPassword(formObj);

        if(!error) {
            let { data: profiles, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', loginData.user.id)
                console.log(profiles)

                setUser(profiles[0]);
                navigate('/');
        }
  
    }

    return (
        <div className="authentication-page">

            <div className="container">

                <form onSubmit={handleLogin}>
                    <h1>Giriş Yap</h1>
                    <div>
                        <p>E-posta</p>
                        <input type="email" name="email" required />
                    </div>
                    <div>
                        <p>Şifre</p>
                        <input type="password" name="password" required />
                    </div>
                    <button>Giriş Yap</button>
                </form>

                <form onSubmit={handleSignup}>
                    <h1>Kayıt Ol</h1>
                    <div>
                        <p>Ad Soyad</p>
                        <input type="text" name="fullname" required />
                    </div>
                    <div>
                        <p>Kullanıcı Adı</p>
                        <input type="text" name="username" required />
                    </div>
                    <div>
                        <p>E-posta</p>
                        <input type="email" name="email" required />
                    </div>
                    <div>
                        <p>Şifre</p>
                        <input type="password" name="password" required />
                    </div>
                    <button>Kayıt Ol</button>
                </form>

            </div>

        </div>
    )
}