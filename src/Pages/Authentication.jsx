import { useNavigate } from "react-router-dom";
import { supabase } from "../main";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";

export default function Authentication() {

    const {user, setUser, setNotification, setOpenNotification} = useContext(UserContext);
    const [allUsers, setAllUsers] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            
            let { data: profiles, error } = await supabase
                .from('profiles')
                .select('username')

                setAllUsers(profiles);
        }
        fetchData();
    }, [])

    async function handleSignup(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const formObj = Object.fromEntries(formData);

        for( let i = 0; i < allUsers?.length; i++ ){
            if(formObj.username === allUsers[i].username) {
                setOpenNotification(true);
                setNotification('Kullanıcı adı kullanımda!')
                return;
            }
        }

        if(formObj.username.length < 6) {
            setOpenNotification(true);
            setNotification('Kullanıcı adı 6 karakterden küçük olamaz.')
            return;
        }

        if(formObj.username.includes(' ')) {
            setOpenNotification(true);
            setNotification('Kullanıcı adında boşluk kullanılamaz!')
            return;
        }

        if(formObj.username.includes('.') || formObj.username.includes(',') || formObj.username.includes('-') || formObj.username.includes('_') || formObj.username.includes(':') || formObj.username.includes('?') || formObj.username.includes('!') || formObj.username.includes('$') || formObj.username.includes('"') || formObj.username.includes('=') || formObj.username.includes('(') || formObj.username.includes(')') || formObj.username.includes('*')) {
            setOpenNotification(true);
            setNotification('Kullanıcı adında özel karakter kullanılamaz!')
            return;
        }

        if(formObj.username.includes('ş') || formObj.username.includes('ç') || formObj.username.includes('ü') || formObj.username.includes('ö') || formObj.username.includes('ı') || formObj.username.includes('ğ')) {
            setOpenNotification(true);
            setNotification('Kullanıcı adında türkçe karakter kullanılamaz!')
            return;
        }

        for (var i = 0; i < formObj.username.length; i++) {
            if (formObj.username[i] !== formObj.username[i].toLowerCase()) {
                setOpenNotification(true);
                setNotification('Kullanıcı adı sadece küçük harf içermelidir!');
                return;
            }
        }

        if(formObj.password.length < 6) {
            setOpenNotification(true);
            setNotification('Şifre 6 karakterden kısa olamaz!')
            return;
        }
        
        let { data, error } = await supabase.auth.signUp({
            email: formObj.email,
            password: formObj.password
        })

        if(error && error.status === 422) {
            setOpenNotification(true);
            setNotification('E-posta zaten kayıtlı!')
        }

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