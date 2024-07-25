import { useContext } from "react"
import { UserContext } from "../App"
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../main";

export default function NewPost() {

    const {user, setUser} = useContext(UserContext);

    const navigate = useNavigate();

    async function handleAddPost(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const formObj = Object.fromEntries(formData);

        const { data: addPost } = await supabase
            .from('posts')
            .insert([
                {
                    text: formObj.text,
                    title: formObj.title,
                    username: user?.username,
                    category: formObj.category
                }
            ])
            .select()

            const { data, error } = await supabase
                .storage
                .from('photos')
                .upload(`${user?.user_id}/post_photos/${user?.user_id}-${addPost[0]?.post_id}.jpg`, formObj.file);

            const { data: update, error: updateError } = await supabase
                .from('posts')
                .update({ post_image: `https://epmupsogvmdpvxmkzrdr.supabase.co/storage/v1/object/public/${data?.fullPath}` })
                .eq('post_id', addPost[0]?.post_id)
                .select()

            if(!updateError) {
                navigate('/');
            }

    }

    return (
        <div className="new-post-page">

            {
                user ?

                <div className="container">
                    <form onSubmit={handleAddPost}>
                        <div>
                            <p>Başlık *</p>
                            <input name="title" placeholder="Kısa başlıklar okuyucunun dikkatini daha hızlı çekebilir." type="text" required/>
                        </div>
                        <div>
                            <p>Metin *</p>
                            <textarea placeholder="Kısa paragraflar, aktif ve akıcı dil ile özgün yazılar yaz. " rows={20} name="text" required></textarea>
                        </div>
                        <div>
                            <p>Kategori *</p>
                            <select name="category" id="" required>
                                <option value="" selected disabled>Kategori Seç</option>
                                <option value="ekonomi">Ekonomi</option>
                                <option value="siyaset">Siyaset</option>
                                <option value="yemek">Yemek</option>
                                <option value="spor">Spor</option>
                                <option value="sanat">Sanat</option>
                                <option value="teknoloji">Teknoloji</option>
                                <option value="sinema">Sinema</option>
                                <option value="seyahat">Seyahat</option>
                            </select>
                        </div>
                        <div>
                            <p>Görsel *</p>
                            <input required type="file" name="file" accept="image/*" />
                        </div>
                        <button>Gönderi Paylaş</button>
                    </form>
                </div>

                :

                <div className="container">
                    <p className="warning">Gönderi paylaşmak için <Link to={'/giris-yap'}>giriş yap</Link>malısınız.</p>
                </div>
            }

        </div>
    )
}