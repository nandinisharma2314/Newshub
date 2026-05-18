import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";

const News = (props) => {
    const [articles, setArticles] = useState([]), [loading, setLoading] = useState(true), [page, setPage] = useState(1), [totalResults, setTotalResults] = useState(0);

    const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

    const updateNews = async () => {
        try {
            props.setProgress(10);
            const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
            setLoading(true);
            const response = await fetch(url);
            props.setProgress(30);
            const parsedData = await response.json();
            props.setProgress(70);

            if (parsedData.status !== "ok") return console.error(parsedData), setArticles([]), setLoading(false);

            setArticles(parsedData.articles || []);
            setTotalResults(parsedData.totalResults || 0);
            setLoading(false);
            props.setProgress(100);
        } catch (error) {
            console.error(error);
            setArticles([]);
            setLoading(false);
        }
    };

    useEffect(() => { document.title = `${capitalizeFirstLetter(props.category)} - NewsHub`; updateNews(); }, []);

    const fetchMoreData = async () => {
        try {
            const nextPage = page + 1;
            setPage(nextPage);

            const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${nextPage}&pageSize=${props.pageSize}`;

            const response = await fetch(url);
            const parsedData = await response.json();

            if (parsedData.status !== "ok") return;

            setArticles((prevArticles) => prevArticles.concat(parsedData.articles || []));
            setTotalResults(parsedData.totalResults || 0);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <h1 className="text-center" style={{ margin: "35px 0px", marginTop: "90px" }}>NewsHub - Top {capitalizeFirstLetter(props.category)} Headlines</h1>

            {loading && <Spinner />}

            <InfiniteScroll dataLength={articles?.length || 0} next={fetchMoreData} hasMore={articles.length !== totalResults} loader={<Spinner />}>
                <div className="container">
                    <div className="row">
                        {articles?.map((element) => <div className="col-md-4" key={element.url}><NewsItem title={element.title || ""} description={element.description || ""} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source?.name} /></div>)}
                    </div>
                </div>
            </InfiniteScroll>
        </>
    );
};

News.defaultProps = { country: "us", pageSize: 8, category: "general" };
News.propTypes = { country: PropTypes.string, pageSize: PropTypes.number, category: PropTypes.string };

export default News;