import { useEffect, useState } from "react"
import { supabase } from "../main";
import { BeatLoader } from "react-spinners";
import { Link } from "react-router-dom";

export default function Home() {

    const [postsData, setPostsData] = useState(null);
    const [profilesData, setProfilesData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchData() {

            setLoading(true)

            let { data: posts, error } = await supabase
                .from('posts')
                .select('*')
                setPostsData(posts);

            let { data: profiles } = await supabase
            .from('profiles')
            .select('*')
                setProfilesData(profiles);

            setLoading(false)

        }
        fetchData();
    }, [])

    return (
        <div className="home-page">

            <div className="homepage-video">
                <video autoPlay loop muted>
                    <source src="./assets/videos/homepage.mp4" type="video/mp4"/>
                </video>
                <div className="video-opacity">
                    <h3>Dünyada görmek istediğin değişimin kendisi ol.</h3>
                </div>
            </div>
            
            {
                loading ?
                <div className="loading">
                    <BeatLoader color="#fff" />
                </div>
                :
                <div className="posts">
                    <div className="container">
                    {
                        postsData && postsData.map(x => (
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
                    }
                    </div>
                </div>
            }


        </div>
    )
}