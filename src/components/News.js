import React, { useEffect, useState } from "react";
import Newsitem from "./Newsitem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

const News=(props)=> {

  const [articles,setArticles] = useState([]);
  const [loading,setLoading] = useState(false);
  const [page,setPage] = useState(1);
  const [totalResults,setTotalResults] = useState(0);
  
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  
  
  const updateNews = async() => {
    props.setProgress(10);
    let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
    setLoading(true);
    let data = await fetch(url);
    props.setProgress(30);
    let parsedData = await data.json();
    props.setProgress(70);
    setArticles(parsedData.articles);
    setTotalResults(parsedData.totalResults);
    setLoading(false);
    props.setProgress(100);
  }
  
  useEffect(()=>{
    document.title = `${capitalizeFirstLetter(props.category)} - NewsMonkey`;
    updateNews();
    // eslint-disable-next-line
  },[])

  // const handlePrevClick = async () => {
  //   // console.log("hello")
  //   setPage(page-1);
  //   updateNews();
  // };
  // const handleNextClick = async () => {
  //   setPage(page+1);
  //   updateNews();
  // };

  const fetchMoreData = async() => {
    // setPage(page+1);
    let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page+1}&pageSize=${props.pageSize}`;
    setPage(page+1);
    let data = await fetch(url);
    let parsedData = await data.json();
    setArticles(articles.concat(parsedData.articles));
    setTotalResults(parsedData.totalResults);
    
  }


    return (
      <>
        {/* <div className="container my-3"> */}
          <h1 className="text-center my-2" style={{margin: "90px 0px 35px 0px"}}>NewsMonkey-Top {capitalizeFirstLetter(props.category)} Headlines</h1>
          {loading && <Spinner />}
          <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={articles.length !== totalResults}
          loader={<Spinner/>}
          >
            <div className="container">
          <div className="row">
            {/* {!loading && */}
                {articles.map((element) => {
                return (
                  <div className="col-md-4" key={element.url}>
                    <Newsitem
                      title={element.title ? element.title.slice(0, 44) : ""}
                      description={
                        element.description?element.description.slice(0, 85):""
                      }
                      imageUrl={element.urlToImage}
                      newsUrl={element.url}
                      author={element.author}
                      date={element.publishedAt}
                      source={element.source.name}
                    />
                  </div>
                );
              })}
          </div>
          </div>
          </InfiniteScroll>
      </>
    );
}

News.defaultProps = {
  country: "in",
  pageSize: 12,
  category: "general",
};
News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
};

export default News;
