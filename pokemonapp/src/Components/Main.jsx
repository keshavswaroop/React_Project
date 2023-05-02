import React from "react";
import Card from "./Card";
import Pokeinfo from "./Pokeinfo";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { clear } from "@testing-library/user-event/dist/clear";

import "bootstrap/dist/css/bootstrap.min.css";
const Main=()=>{
    const [pokeData,setPokeData]=useState([]);
    const [loading,setLoading]=useState(true);
    const [url,setUrl]=useState("https://pokeapi.co/api/v2/pokemon?limit=10&offset=0")
    const [nextUrl,setNextUrl]=useState();
    const [prevUrl,setPrevUrl]=useState();
    const [pokeDex,setPokeDex]=useState();
    const [search, getSearch]=useState(0);

    const pokeFun=async()=>{
        setLoading(true)
        const res=await axios.get(url);
        setNextUrl(res.data.next);
        setPrevUrl(res.data.previous);
        getPokemon(res.data.results)
        setLoading(false)
    }
    const getPokemon=async(res)=>{
       res.map(async(item)=>{
          const result=await axios.get(item.url)
          setPokeData(state=>{
              state=[...state,result.data]
              state.sort((a,b)=>a.id>b.id?1:-1)
              return state;
          })
       })   
    }
    useEffect(()=>{
        pokeFun();
    },[url])
    

    const [text, setText] = useState("");
  const onChange = (e) => {
    setText(e.target.value); //this line can be used to set the state of multiple inputs
  };
  const onSubmit = async (e) => {
    
    e.preventDefault();
    getSearch(1);

    if (text === "") {
      alert("Please enter something");
    } else {
        const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${text}`);
        setPokeData(state=>{
            state=[res.data]
            state.sort((a,b)=>a.id>b.id?1:-1)
            return state;
        })
    }
  };

  const clearSearch = () => {
    //clearPokemons();
    getSearch(0);
    getPokemon();
    pokeFun();
    setText("");

  };



    return(
        <>
        <div>
      <div class="container">
        <div class="row ">
          <div class="col ">
            <div class="search-box ">
              <form onSubmit={onSubmit} className="form">
                <input
                  id="search"
                  type="text"
                  name="text"
                  value={text}
                  onChange={onChange}
                  placeholder="Search Pokemon..."
                  class="form-control search-bar mb-4"
                />
                <input
                  type="submit"
                  value="Search"
                  className="btn btn-dark btn-block"
                ></input>
                
              </form>
              {(
                  <button
                    onClick={clearSearch}
                    className="btn btn-light btn-block m-2"
                  >
                    CLEAR
                  </button>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
            <div className="container">
                <div className="left-content">
                    <Card pokemon={pokeData} loading={loading} infoPokemon={poke=>setPokeDex(poke)}/>
                    
                    {

                    !search &&

                    <div className="btn-group">
                        {  prevUrl && <button onClick={()=>{
                            setPokeData([])
                           setUrl(prevUrl) 
                        }}>Previous</button>}

                        { nextUrl && <button onClick={()=>{
                            setPokeData([])
                            setUrl(nextUrl)
                        }}>Next</button>}

                    </div>

}
                </div>
                <div className="right-content">
                   <Pokeinfo data={pokeDex}/>
                </div>
            </div>
        </>
    )
}
export default Main;