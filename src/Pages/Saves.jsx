import { useContext, useEffect, useState } from "react"
import { UserContext } from "../App"
import { supabase } from "../main";
import { BeatLoader } from "react-spinners";
import { Link } from "react-router-dom";
export default function Saves() {

    const {user, setUser} = useContext(UserContext);
    const [postsData, setPostsData] = useState(null);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {

            setLoading(true)

            const { data: { user } } = await supabase.auth.getUser()
            
            let { data: saves, error } = await supabase
                .from('saves')
                .select('*')
                .eq('user_id', user?.id)

            let { data: posts } = await supabase
            .from('posts')
            .select('*')
            .in('post_id', saves && saves.map(x => x.post_id))
            .order('created_at', { ascending: false });

            setPostsData(posts);
            setLoading(false)


        }
        fetchData();

    }, [])

    return (
        <div className="posts">

            {
                user ?
                loading ?
                <div className="loading">
                    <BeatLoader color="#fff" />
                </div>
                :
                <div className="posts">
                    <div style={postsData?.length < 1 ? {display: 'flex'} : {}} className="container">
                    {
                        postsData.length > 0 ? postsData.map(x => (
                            <Link to={`/${x.username}/post/${x.post_id}`} key={x.post_id} className="post-item">
                                <div className="post-item-image">
                                    <img src={x.post_image} alt="" />
                                    <div className="post-opacity">
                                        <p><i className="fa-solid fa-hashtag"></i><Link to={`/kategori/${x.category}`}>{x.category}</Link></p>
                                        <p><i className="fa-solid fa-user"></i><Link to={`/profil/${x.username}`}>{x.username}</Link></p>
                                        
                                    </div>
                                </div>
                                <h3>{x.title}</h3>
                            </Link>
                        ))
                        :
                        <p className="warning">Kaydedilmiş bir gönderi bulunamadı!</p>
                    }
                    </div>
                </div>
                :
                <div style={{display: 'flex'}} className="container">
                    <p className="warning">Kaydedilmiş gönderileri görmek için <Link>giriş yap</Link>malısınız!</p>
                </div>
            }

        </div>
    )
}