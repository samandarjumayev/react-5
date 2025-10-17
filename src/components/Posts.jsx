import { useEffect, useState } from "react"
import axios from 'axios'

export default function Posts(){
    const [allPosts, setAllPosts] = useState();
    const [posts, setPosts] = useState([]);
    const [visits, setVisits] = useState([]);
    const [startPage, setStartPage] = useState(0);
    const [endPage, setEndPage] = useState(6);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [isSearching, setIsSearching] = useState(false);
    let URL = 'https://dummyjson.com/posts';
    let visitedUsersURL = 'https://68f1df7fb36f9750deea834e.mockapi.io/visited'

    // Add user count
    if(!localStorage.getItem('enter')){
        localStorage.setItem('enter', true);
        addUsersCount();
    }

    // get user count
    async function getUserCount(){
        let visit = await fetch(visitedUsersURL);
        let visResp = await visit.json();
        setVisits(visResp['0']);
    }
    // Add user count
    async function addUsersCount(){
        let sum = visits.count;
        await fetch(`${visitedUsersURL}/1`, {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({count: ++sum})
        });
        getUserCount();
    }
    // localStorage.clear()


    // get
    async function getFetch(){
        setLoading(true)
        let resp = await fetch(URL);
        let pos = await resp.json();
        setPosts(pos.posts);
        setAllPosts(pos.posts);

        // 👇🏻😅 
        setTimeout(() => {
            setLoading(false)
        }, 2000)
    }

    // search
    async function searchData(text){
        if(text == ''){
            setPosts(allPosts);
            setIsSearching(false);
        }
        let foundData = allPosts.filter((item, index) => item.title.toLowerCase().includes(text));
        setPosts(foundData);
    }

    useEffect(() => {
        getFetch();
        getUserCount();
    }, [])

    return <div className="h-[100vh] max-w-[1100px] mx-auto flex flex-col py-5 gap-4">
        <div className="h-[70px] flex items-center">
            <input onChange={(e) => {
                setIsSearching(true);
                console.log(e.target.value);
                searchData(e.target.value.toLowerCase());
            }} type="text" placeholder="Search" className="h-[40px] border w-full px-7 shadow-lg rounded border-zinc-400 outline-none" />
        </div>

        {loading ? (
            <div role="status" className="animate-pulse flex-1 w-full overflow-auto grid grid-cols-3 grid-rows-2 gap-7">
                <div className="bg-gray-100 dark:bg-gray-400 rounded-[7px] overflow-hidden shadow-lg cursor-pointer"></div>
                <div className="bg-gray-100 dark:bg-gray-400 rounded-[7px] overflow-hidden shadow-lg cursor-pointer"></div>
                <div className="bg-gray-100 dark:bg-gray-400 rounded-[7px] overflow-hidden shadow-lg cursor-pointer"></div>
                <div className="bg-gray-100 dark:bg-gray-400 rounded-[7px] overflow-hidden shadow-lg cursor-pointer"></div>
                <div className="bg-gray-100 dark:bg-gray-400 rounded-[7px] overflow-hidden shadow-lg cursor-pointer"></div>
                <div className="bg-gray-100 dark:bg-gray-400 rounded-[7px] overflow-hidden shadow-lg cursor-pointer"></div>
            </div>
        ) : (
            <div className="h-[calc(100vh-150px)] w-full grid grid-cols-3 grid-rows-2 gap-7">
                {
                   posts.slice(isSearching ? 0 : startPage, isSearching ? 6 : endPage).map((item, index) => {
                        return <div key={index} className="border border-zinc-400 rounded-[7px] overflow-hidden shadow-lg cursor-[context-menu] flex flex-col justify-between">
                            <div className="flex-1 p-2 px-3 overflow-hidden">
                                <h3 className="text-[16px] my-1 mb-2 leading-[19px] font-[500]">{item.title}</h3>
                                <p className="text-[14px] text-zinc-700 leading-[18px]">{item.body}</p>
                            </div>

                            <div className="w-full h-[45px] flex items-center justify-end gap-3 px-4">
                                <p className="text-zinc-500 text-[15px]"><i className="fa-solid fa-eye"></i> {item.views}</p>
                                <p className="text-zinc-500 text-[15px]"><i className="fa-solid fa-thumbs-up"></i> {item.reactions.likes}</p>
                                <p className="text-zinc-500 text-[15px]"><i className="fa-solid fa-thumbs-down"></i> {item.reactions.dislikes}</p>
                            </div>
                        </div>
                    }) 
                }
            </div>
        )}

        <div className="relative w-full h-[50px]] flex items-center justify-center gap-4">
            {/* <p className='absolute left-0'>Visited users: {visits.count}</p> */}

            <button onClick={() => {
                if(startPage > 0){
                    setLoading(true);
                    setStartPage(startPage - 6);
                    setEndPage(endPage - 6);
                    setPage((prev) => prev - 1);
                    setLoading(false);
                }
            }} className="bg-blue-500 rounded text-white shadow-lg cursor-pointer h-full px-3 py-1 text-[18px] transition-all duration-250 active:duration-90 active:scale-90">
                <i className="fa-solid fa-backward"></i>
            </button>

            <p className="text-xl font-[700] font-[cursive] text-blue-600">{isSearching ? <i className="fa-solid fa-search"></i> : page}</p>

            <button onClick={() => {
                if(endPage < 30){
                    setLoading(true);
                    setStartPage(startPage + 6);
                    setEndPage(endPage + 6);
                    setPage((prev) => prev + 1);
                    setLoading(false);
                }
            }} className="bg-blue-500 rounded text-white shadow-lg cursor-pointer h-full px-3 py-1 text-[18px] transition-all duration-250 active:duration-90 active:scale-90">
                <i className="fa-solid fa-forward"></i>
            </button>
        </div>

    </div>
}