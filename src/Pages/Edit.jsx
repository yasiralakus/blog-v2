import { useContext, useEffect, useState } from "react";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import { supabase } from "../main";

export async function loader( {params} ){

    return params;
}

export default function Edit() {

    const params = useLoaderData();
    const {user, setUser} = useContext(UserContext);
    const [profileData, setProfileData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            
            let { data: profiles, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('username', params?.username)

                setProfileData(profiles[0])

        }
        fetchData();
    }, [])

    async function handleEdit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const formObj = Object.fromEntries(formData);

        if(formObj.user_background.size > 0) {
            const { data: bgPic, error } = await supabase
                .storage
                .from('photos')
                .upload(`${user?.user_id}/profile_photos/background_photos/${user?.user_id}-${Math.floor(Math.random() * 100000)}.jpg`, formObj.user_background);

            if(!error) {
                const { data, error } = await supabase
                    .from('profiles')
                    .update([
                        {
                            user_background: `https://epmupsogvmdpvxmkzrdr.supabase.co/storage/v1/object/public/${bgPic.fullPath}`,
                        }
                    ])
                    .eq('username', params?.username)
                    .select()
            }
        }

        if(formObj.user_photo.size > 0) {
            const { data: userPic, error } = await supabase
                .storage
                .from('photos')
                .upload(`${user?.user_id}/profile_photos/user_photos/${user?.user_id}-${Math.floor(Math.random() * 100000)}.jpg`, formObj.user_photo);

            if(!error) {
                const { data, error } = await supabase
                    .from('profiles')
                    .update([
                        {
                            user_photo: `https://epmupsogvmdpvxmkzrdr.supabase.co/storage/v1/object/public/${userPic.fullPath}`,
                        }
                    ])
                    .eq('username', params?.username)
                    .select()
            }
        }

        const { data, error } = await supabase
            .from('profiles')
            .update([
                {
                    fullname: formObj?.fullname,
                    biography: formObj?.biography,
                    gender: formObj?.gender
                }
            ])
            .eq('username', params?.username)
            .select()

        navigate(`/profil/${params?.username}`)

    }

    return (
        <div className="edit-page">

            {
                user === null ?
                <div className="container">
                    <p className="warning">Profil düzenleme işlemi için <Link to={'/giris-yap'}>giriş yap</Link>malısınız.</p>
                </div>
                :
                user?.username === profileData?.username ?
                <div className="container">
                    <form onSubmit={handleEdit}>
                        <div>
                            <p>Ad Soyad</p>
                            <input type="text" name="fullname" defaultValue={profileData?.fullname} />
                        </div>
                        <div>
                            <p>Biyografi</p>
                            <textarea name="biography" rows={6} defaultValue={profileData?.biography}></textarea>
                        </div>
                        <div>
                            <p>Profil Fotoğrafı</p>
                            <input type="file" name="user_photo" />
                        </div>
                        <div>
                            <p>Kapak Fotoğrafı</p>
                            <input type="file" name="user_background" />
                        </div>
                        <div>
                            <p>Cinsiyet</p>
                            <select name="gender">
                                <option selected={profileData?.gender === 'Belirtilmemiş'} value="Belirtilmemiş">Belirtilmemiş</option>
                                <option selected={profileData?.gender === 'Kadın'} value="Kadın">Kadın</option>
                                <option selected={profileData?.gender === 'Erkek'} value="Erkek">Erkek</option>
                            </select>
                        </div>
                        <button>Değişiklikleri Kaydet</button>
                    </form>
                </div>
                :
                <div className="container">
                    <p className="warning">Yalnızca kendi profilinizi düzenleyebilirsiniz!</p>
                </div>
            }

        </div>
    )
}