import { useContext, useEffect, useState } from "react"
import { UserContext } from "../App";
import { supabase } from "../main";
import { BeatLoader } from "react-spinners";
import { Link } from "react-router-dom";

export default function Followings() {

    const {user, setUser} = useContext(UserContext);
    const [postsData, setPostsData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {

            setLoading(true)

            const { data: { user } } = await supabase.auth.getUser()

            let { data: follows, error } = await supabase
                .from('follows')
                .select('*')
                .eq('takipeden_id', user?.id)

            let { data: posts} = await supabase
                .from('posts')
                .select('*')
                .in('user_id', follows && follows.map(x => (x.takipedilen_id)))

            setPostsData(posts)

            setLoading(false)

        }
        fetchData();
    }, [])

    return (
        <div className="posts">


            {
                user === null ?
                <div style={{display: 'flex'}} className="container">
                    <p className="warning">Takip ettiğiniz kişilerin gönderilerini görmek için <Link to={'/giris-yap'}>giriş yap</Link>malısınız!.</p>
                </div>
                :
                loading ?
                <div className="loading">
                    <BeatLoader color="#fff" />
                </div>
                :
            <div className="container">
                <div className="posts">
                    <div className="container">
                    {
                        postsData && postsData.map(x => (
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
                    }
                    </div>
                </div>
            </div>
            }


        </div>
    )
}