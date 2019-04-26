import React, { useState , useEffect } from 'react';
import {BASE_URI} from '../services';
import InfiniteScroll from 'react-infinite-scroll-component';

let limit = 16;
let offset = 0;

const token = ' eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMDI3LCJ1c2VybmFtZSI6Ijk4MTE4ODU5ODkiLCJleHAiOjE1NTYzNTE2NDUsImVtYWlsIjoia2xzYWRqbGFAYXNkLmFjb20iLCJtb2JpbGUiOiI5ODExODg1OTg5Iiwib3JpZ19pYXQiOjE1NTYyNjUyNDV9.sPu7_zX92NntRXGTmWrKykQp5nJBFEIlNvWFsmGwkCA'

export default () =>  {
    const [funds, setFunds] = useState([])

    useEffect(() => {
        fetchFunds();
    },[])

    const fetchFunds = async() => {
        try {
            let fundsList = await fetch(`${BASE_URI}?limit=${limit}&offset=${offset}`,{
                headers: {
                  'Authorization': 'bearer' + token
                }
            })
            let json = await fundsList.json();                                    
            if(json.data.length){
                let updatedFunds = [...funds,...json.data]
                setFunds(updatedFunds)  
                // setisLoading(true)          
            }
        } catch (e){
            throw e
        }
    }

    const getFundName = (string) => {
        if (string.length > 25)
           return string.substring(0,25)+'...';
        else
           return string;
    };

    const getStars = (starRating) => {
        var stars = [];                   
        for(let i = 0; i <= starRating; i++){
            stars.push(<span className="fa fa-star checked" key={Math.random()}></span>)
        }

        return stars;
    }

    const getFunds = () => {        
            return funds.map((fund,index) => {
                return (
                    <div className="col-md-6 mb-5" key={index}>
                            <div className="card">
                                <div className="row">
                                    <div className="col-md-8">
                                        <h5 className="mb-5 text-left" title={fund.name}><b>{getFundName(fund.name)}</b></h5> 
                                    </div>
                                    <div className="col-md-4">
                                        <p className="text-right">
                                            {getStars(fund.rating)}
                                        </p> 
                                    </div>
                                </div>
                                <div className="funds-props">
                                    <div className="prop">
                                        <p>1 year returns</p>
                                        <h5 className="return">{fund.returns.oneYear}%</h5>
                                    </div>
                                    <div className="prop">
                                        <p>AUM</p>
                                        <h5>{(fund.aum * 10000000).toString().slice(0,4)} Cr</h5>
                                    </div>
                                    <div className="prop">
                                        <p>Expense Ratio</p>
                                        <h5>{fund.expenseRatio}%</h5>
                                    </div>
                                </div>
                            </div>
                        </div>  
                    )
            })
    }

    const loadMoreFunds = () => {
        // setisLoading(false)
        limit = limit + 16;
        offset = offset + 16;
        fetchFunds()
    }
    
    return (
        <div>
            {
                funds.length ? (
                    <InfiniteScroll
                    dataLength={funds.length} //This is important field to render the next data
                    next={loadMoreFunds}
                    hasMore={true}
                    loader={<h4 className="ml-5">Loading...</h4>}
                >
                <div className="container">
                            <div>
                                <h2 className="mb-3"><b>Explore Funds</b></h2>
                                <p>Showing <b>{funds.length}</b> funds</p>
                                
                                    <div className="row">
                                            {getFunds()} 
                                    </div>
                                <div className="text-center">
                                    <button onClick={() => loadMoreFunds()}>Load More</button>
                                </div>
                            </div>
                </div>
            </InfiniteScroll>
            ) : <img className="loader-image" src="https://thumbs.gfycat.com/UnitedSmartBinturong-small.gif" alt="loader"/>
        }
        </div>
    )
}

