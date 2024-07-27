import { useContext, useEffect, useState } from "react";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { supabase } from "../main";
import { UserContext } from "../App";
import ReactMarkdown from 'react-markdown';

export async function loader({params}) {

    return params;
}

export default function Post() {

    const params = useLoaderData();
    const [postData, setPostData] = useState(null);
    const [profileData, setProfileData] = useState(null);
    const [isLike, setIsLike] = useState(false);
    const {user, setUser} = useContext(UserContext);
    const [totalLike, setTotalLike] = useState(null);
    const [postComments, setPostComments] = useState(null);
    const [allUserData, setAllUserData] = useState(null);
    const [isSave, setIsSave] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {

            const { data: { user } } = await supabase.auth.getUser()

            let { data: allUsers } = await supabase
                .from('profiles')
                .select('*')

                setAllUserData(allUsers)

            let { data: posts, error } = await supabase
                .from('posts')
                .select('*')
                .eq('post_id', params?.post_id)

                setPostData(posts[0]);

            
            let { data: profiles } = await supabase
                .from('profiles')
                .select('*')
                .eq('username', params?.username)

                setProfileData(profiles[0]);

                
            let { data: likes } = await supabase
                .from('likes')
                .select('*')
                .eq('post_id', params?.post_id)
                .eq('user_id', user?.id)

                setIsLike(likes && likes.length > 0 ? true : false)

                
            let { data: totalikes } = await supabase
                .from('likes')
                .select('*')
                .eq('post_id', params?.post_id)

                setTotalLike(totalikes?.length);

                
            let { data: comments} = await supabase
                .from('comments')
                .select('*')
                .eq('post_id', params?.post_id)
                .order('created_at', { ascending: false });

                setPostComments(comments ? comments : null)

            let { data: saves } = await supabase
                .from('saves')
                .select('*')
                .eq('user_id', user?.id)
                .eq('post_id', params?.post_id)

                setIsSave(saves && saves.length > 0 ? true : false);
            
        }
        fetchData();
    }, [])

    async function handleDelete(commentId) {

        const confirmDelete = window.confirm("Yorumu silmek istediğinizden emin misiniz?");
        console.log(commentId)

        if(confirmDelete === true) {
            
            const { error } = await supabase
                .from('comments')
                .delete()
                .eq('comment_id', commentId)

                const updatedComments = postComments.filter(comment => comment.comment_id !== commentId);
                setPostComments(updatedComments);
        }
    }

    async function handleAddComment(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const formObj = Object.fromEntries(formData);
        
        const { data, error } = await supabase
            .from('comments')
            .insert([
                {
                    comment: formObj.comment,
                    post_id: params?.post_id
                }
            ])
            .select()

            if(!error) {
                setPostComments(prev => [...data, ...prev]);
                e.target.reset()
            }

    }

    async function handleLike(e) {
        e.preventDefault();

        if(isLike) {
            
            const { error } = await supabase
                .from('likes')
                .delete()
                .eq('user_id', user?.user_id)
                .eq('post_id', params?.post_id)

                setIsLike(false);
                setTotalLike(totalLike - 1)

        } else {
            
            const { data, error } = await supabase
                .from('likes')
                .insert([
                    {
                        post_id: params?.post_id,
                    }
                ])
                .select()

                setIsLike(true);
                setTotalLike(totalLike + 1)

        }
    }

    async function handleSave(e) {

        if(isSave) {
            
            const { error } = await supabase
                .from('saves')
                .delete()
                .eq('post_id', params?.post_id)
                .eq('user_id', user?.user_id)

                setIsSave(false);

        } else {
            
            const { data, error } = await supabase
                .from('saves')
                .insert([
                    {
                        post_id: params?.post_id
                    }
                ])
                .select()

                setIsSave(true);

        }
    }

    async function deletePost(e) {
        e.preventDefault();

        const confirmDelete = window.confirm("Gönderiyi silmek istediğinizden emin misiniz?");

        if(confirmDelete === true) {
            
            const { error } = await supabase
                .from('posts')
                .delete()
                .eq('post_id', postData?.post_id)

                navigate('/');
        }

    }

    return (
        <div className="post-page">

            <div className="container">
                {
                    postData ?

                    <>
                        <div className="post-page-header">

                            <h3>{postData?.created_at?.slice(8,10)}.{postData?.created_at?.slice(5,7)}.{postData?.created_at?.slice(0,4)}
                                {
                                    user && user?.username === params?.username &&
                                    <button onClick={deletePost}><i className="fa-solid fa-trash-can"></i></button>
                                }
                            </h3>
                            <h1>{postData?.title}</h1>
                            <p><span></span><Link to={`/kategori/${postData?.category}`}>{postData?.category}</Link></p>

                        </div>

                        <div className="post-page-content">

                            <img src={postData?.post_image} alt="" />

                            <p><ReactMarkdown>{postData?.text}</ReactMarkdown></p>

                        </div>

                        <div className="writer-details">

                            <img src={profileData?.user_photo} alt="" />

                            <div className="writer-text">

                                <h3>{profileData?.fullname} / <Link to={`/profil/${profileData?.username}`}>@{profileData?.username}</Link></h3>
                                
                                <p>{profileData?.biography}</p>
                                <div className="writer-socials-links">
                                    <Link><i className="fa-brands fa-facebook-f"></i></Link>
                                    <Link><i className="fa-brands fa-twitter"></i></Link>
                                    <Link><i className="fa-brands fa-linkedin-in"></i></Link>
                                    <Link><i className="fa-brands fa-youtube"></i></Link>
                                    <Link><i className="fa-brands fa-dribbble"></i></Link>
                                    <Link><i className="fa-brands fa-instagram"></i></Link>
                                </div>

                            </div>

                        </div>

                        {
                            user ?
                            <div className="post-interaction">

                                <button onClick={handleLike}>
                                    {
                                        isLike ?
                                        <i className="fa-solid fa-heart"></i>
                                        :
                                        <i className="fa-regular fa-heart"></i>
                                    }
                                    {totalLike && totalLike}
                                </button>
                                <button onClick={handleSave}>
                                    {
                                        isSave ?
                                        <i className="fa-solid fa-bookmark"></i>
                                        :
                                        <i className="fa-regular fa-bookmark"></i>
                                    }
                                </button>
                                <button><i className="fa-solid fa-share"></i></button>

                            </div>
                            :
                            <p className="warning">Beğenmek ve kaydetmek için <Link to={'/giris-yap'}>giriş yap</Link>malısınız.</p>
                        }

                        <div className="post-comments">

                            <h3>YORUMLAR ({postComments?.length})</h3>

                            {
                                postComments?.length > 0 ?
                                postComments.map(x => (
                                    <div key={x.comment_id} className="post-comment-item">
                                        {
                                            user?.user_id === x.user_id &&
                                            <button onClick={() => handleDelete(x.comment_id)} className="delete-post">
                                                <i className="fa-solid fa-trash-can"></i>
                                            </button>
                                        }
                                        <div className="post-comment-item-header">

                                            <h3>{allUserData.map(y => y.user_id === x.user_id && y.fullname)} / <Link to={`/profile/${allUserData.find(y => y.user_id === x.user_id)?.username || null}`}>@{allUserData.find(y => y.user_id === x.user_id)?.username || null}</Link></h3>

                                        </div>

                                        <p>{x.comment}</p>
                                    </div>
                                ))
                                :
                                <p className="warning">Henüz yorum yapılmamış.</p>
                            }

                        </div>

                        {
                            user ?
                            <div className="add-comment">
                                <h3>YORUM YAP</h3>
                                <form onSubmit={handleAddComment}>
                                    <textarea name="comment" rows={8} required ></textarea>
                                    <button>Yorum Yap</button>
                                </form>
                            </div>
                            :
                            <p className="warning">Yorum yapmak için <Link to={'/giris-yap'}>giriş yap</Link>malısınız.</p>
                        }
                    </>

                    :
                    <p>Paylaşım bulunamadı!</p>
                    
                }
            </div>

        </div>
    )
}