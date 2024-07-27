import { useContext, useEffect, useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import { supabase } from "../main";
import { UserContext } from "../App";
import { BeatLoader } from "react-spinners";

export async function laoder( {params} ){
    return params;
}

export default function Profile() {

    const params = useLoaderData();
    const [profileData, setProfileData] = useState(null);
    const {user, setUser} = useContext(UserContext);
    const [loading, setLoading] = useState(true);
    const [postsData, setPostsData] = useState(null)
    const [isFollowing, setIsFollowing] = useState(null);

    const [takipEttiklerim, setTakipEttiklerim] = useState(null);
    const [takipEttiklerimSayi, setTakipEttiklerimSayi] = useState(null);
    const [takipEdenler, setTakipEdenler] = useState(null);
    const [takipeEdenlerSayi, setTakipEdenlerSayi] = useState(null);

    useEffect(() => {

        async function fetchData() {

            setLoading(true);
            
            const { data: { user } } = await supabase.auth.getUser()
            
            let { data: profiles} = await supabase
                .from('profiles')
                .select('*')
                .eq('username', params?.username)

                setProfileData(profiles[0]);
                
            let { data: follows, error} = await supabase
                .from('follows')
                .select('*')
                .eq('takipeden_id', user?.id)
                .eq('takipedilen_id', profiles[0]?.user_id)

            let { data: takipedenData } = await supabase
                .from('follows')
                .select('*')
                .eq('takipedilen_id', profiles[0]?.user_id)

                setTakipEdenler(takipedenData);
                setTakipEdenlerSayi(takipedenData && takipedenData.length)

            let { data: takipedilenData } = await supabase
                .from('follows')
                .select('*')
                .eq('takipeden_id', profiles[0]?.user_id)

                setTakipEttiklerim(takipedilenData);
                setTakipEttiklerimSayi(takipedilenData && takipedilenData.length);

                setIsFollowing(follows && follows.length > 0 ? true : false);

            let { data: posts} = await supabase
                .from('posts')
                .select('*')
                .eq('username', profiles[0]?.username)

                setPostsData(posts)

                setLoading(false);

        }

        fetchData();

    }, [params?.username])

    async function handleFollow(e) {
        e.preventDefault();

        if(isFollowing) {
            
            const { error } = await supabase
                .from('follows')
                .delete()
                .eq('takipeden_id', user?.user_id)
                .eq('takipedilen_id', profileData?.user_id)

                setTakipEdenlerSayi(takipeEdenlerSayi - 1)
                setIsFollowing(false)

        } else {
            
            const { data, error } = await supabase
                .from('follows')
                .insert([
                    {
                        takipedilen_id: profileData?.user_id
                    }
                ])
                .select()

                setTakipEdenlerSayi(takipeEdenlerSayi + 1)
                setIsFollowing(true)

        }
    }

    return (
        <div className="profile-page">

            <div className="profile-photos">
                <div className="container">
                    <img id="profile-bg" src={profileData?.user_background} alt="" />
                    <img id="profile-photo" src={profileData?.user_photo} alt="" />
                </div>
            </div>

            <div className="profile-details">
                <div className="container">

                    <div>
                        <h1>{profileData?.fullname}</h1>
                        <h2>@{profileData?.username}</h2>
                        <h6>{profileData?.biography}</h6>
                    </div>

                    <div className="profile-follow-box">
                        {
                            user === null ?
                            <></>
                            :
                            <div className="edit-or-follow">
                                {
                                    user?.username === profileData?.username ?
                                    <Link to={`/profil/${user?.username}/duzenle`}>Düzenle</Link>
                                    :
                                    <button onClick={handleFollow}>{isFollowing ? 'Takip Ediliyor' : 'Takip Et'}</button>
                                }
                            </div>
                        }

                        <p>{takipEttiklerimSayi}<Link to={`/${profileData?.username}/takipciler`}>Takip edilen</Link></p>
                        <p>{takipeEdenlerSayi}<Link to={`/${profileData?.username}/takipciler`}>Takipçi</Link></p>
                    </div>

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
            }

        </div>
    )
}