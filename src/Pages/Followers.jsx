import { useEffect, useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import { supabase } from "../main";

export async function loader ( {params} ){

    return params;
}

export default function Followers() {

    const params = useLoaderData();
    const [takipedilen, setTakipedilen] = useState(null);
    const [takipci, setTakipci] = useState(null);
    const [showFollowers, setShowFollowers] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function fetchData() {

            let { data: profiles, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('username', params?.username)

                if(!profiles.length > 0) {
                    setError(true);
                }

            let { data: takipedilenData } = await supabase
                .from('follows')
                .select('*')
                .eq('takipeden_id', profiles[0]?.user_id)

            let { data: takipedilenUsers } = await supabase
                .from('profiles')
                .select('*')
                .in('user_id', takipedilenData && takipedilenData.map(x => (x.takipedilen_id)))

                setTakipedilen(takipedilenUsers);

            let { data: takipciData } = await supabase
                .from('follows')
                .select('*')
                .eq('takipedilen_id', profiles[0]?.user_id)

            let { data: takipciUsers } = await supabase
                .from('profiles')
                .select('*')
                .in('user_id', takipciData && takipciData.map(x => (x.takipeden_id)))

                setTakipci(takipciUsers)
        }
        fetchData();
    }, [params?.username])

    return (
        <div className="followers-page">

            <div className="container">

                <div className="followers-page-header">
                    <button style={showFollowers === false ? {backgroundColor: '#171717'} : {}} onClick={() => (setShowFollowers(false))}>Takip edilen ({takipedilen?.length})</button>
                    <button style={showFollowers === true ? {backgroundColor: '#171717'} : {}} onClick={() => (setShowFollowers(true))}>Takipçi ({takipci?.length})</button>
                </div>

                {
                    error ?
                    <p className="warning">Kullanıcı bulunamadı!</p>
                    :
                    showFollowers ?
                    <div className="followers-page-users">
                        {
                            takipci && takipci.map(x => (
                                <div className="followers-page-user-box">
                                    <img src={x.user_photo} alt="" />
                                    <div>
                                        <p>{x.fullname}</p>
                                        <Link to={`/profil/${x.username}`}>@{x.username}</Link>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    :
                    <div className="followers-page-users">
                        {
                            takipedilen && takipedilen.map(x => (
                                <div className="followers-page-user-box">
                                    <img src={x.user_photo} alt="" />
                                    <div>
                                        <p>{x.fullname}</p>
                                        <Link to={`/profil/${x.username}`}>@{x.username}</Link>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                }

            </div>

        </div>
    )
}