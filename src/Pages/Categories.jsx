import { useEffect, useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import { supabase } from "../main";
import { BeatLoader } from "react-spinners";

export async function loader({params}) {

    return params;
}

export default function Categories() {

    const params = useLoaderData();

    const [postsData, setPostsData] = useState(null);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {

            setLoading(true)
            
            let { data: posts, error } = await supabase
                .from('posts')
                .select('*')
                .eq('category', params?.category)
                .order('created_at', { ascending: false });
                
                setPostsData(posts)

            setLoading(false)

        }
        fetchData();
    }, [])

    return (
        <div className="posts">

            {
                loading ?
                <div className="loading">
                    <BeatLoader color="#fff" />
                </div>
                :
                <div className="posts">
                    <div className="container">
                    {
                        postsData.length > 0 ? postsData.map(x => (
                            <Link to={`/${x.username}/post/${x.post_id}`} key={x.post_id} className="post-item">
                                <div className="post-item-image">
                                    <img src={x.post_image} alt="" />
                                    <div className="post-opacity">
                                        <p><i className="fa-solid fa-hashtag"></i><Link>{x.category}</Link></p>
                                        <p><i className="fa-solid fa-user"></i><Link>{x.username}</Link></p>
                                        
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
            }

        </div>
    )
}