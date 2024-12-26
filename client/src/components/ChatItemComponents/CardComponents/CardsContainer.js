import React, { useRef, useEffect, useState } from "react";
import Cards from "./Cards";
import tw from "tailwind-styled-components";
import ChevronLeft from "../../../assets/chevron-left.png";
import ChevronRight from "../../../assets/chevron-right.png";

const Container = tw.div`
  flex flex-row overflow-x-hidden scroll-smooth flex-nowrap 
`;

const CardsContainer = ({ data, isFirstInGroup, isLastInGroup, ratio }) => {
  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    const checkScrollButtons = () => {
      if (containerRef.current) {
        setCanScrollLeft(containerRef.current.scrollLeft > 0);
        setCanScrollRight(
          containerRef.current.scrollLeft <
            containerRef.current.scrollWidth -
              containerRef.current.clientWidth -
              10
        );
      }
    };

    checkScrollButtons();
    const container = containerRef.current;

    container.addEventListener("scroll", checkScrollButtons);

    return () => {
      container.removeEventListener("scroll", checkScrollButtons);
    };
  }, []);

  const handleScroll = (offset) => {
    if (!isScrolling) {
      setIsScrolling(true);
      const scroll = document.getElementById("onScroll");
      scroll.scrollLeft += offset;
      setTimeout(() => {
        setIsScrolling(false);
      }, 300);
    }
  };

  return (
    <div
      className={`relative max-w-[256px] sm:max-w-[390px] md:max-w-[515px] lg:max-w-[970.5px] `}
    >
      {canScrollLeft && (
        <button
          className="absolute  md:min-w-5 md:min-h-5 lg:min-h-10 lg:min-w-10 top-1/4 md:top-1/3 -translate-y-1/2 bg-gray-300 p-2 rounded-full z-10 hover:bg-gray-400 flex items-center justify-center"
          style={{
            transform: "translateX(-50%)",
          }}
          onClick={() =>
            handleScroll(-(cardRef.current ? cardRef.current.offsetWidth : 0))
          }
        >
          <img src={ChevronLeft} alt="Scroll Left" className="h-4 w-4" />
        </button>
      )}
      <Container
        id="onScroll"
        ref={containerRef}
        className={`h-[100%] ${isFirstInGroup ? "rounded-t-lg" : ""} ${
          isLastInGroup ? "rounded-b-lg ml-0" : ""
        }`}
      >
        {data.map((e, i) => (
          <div
            className={`
                min-w-[256px]
                sm:min-w-[200px] 
                md:min-w-[259px] 
                lg:min-w-[485px] 
                sm:pr-2 pr-0
              `}
            style={{
              flex: "1 1 100%",
            }}
            ref={i === 0 ? cardRef : null}
            key={i}
          >
            <Cards data={e} ratio={ratio} />
          </div>
        ))}
      </Container>
      {canScrollRight && (
        <button
          className={`absolute sm:right-2 md:min-w-5 md:min-h-5 lg:min-h-10 lg:min-w-10 right-1 top-1/4 md:top-1/3 -translate-y-1/2 bg-gray-300 p-2 rounded-full z-10 hover:bg-gray-400 flex items-center justify-center`}
          style={{
            transform: "translateX(50%)",
          }}
          onClick={() =>
            handleScroll(cardRef.current ? cardRef.current.offsetWidth : 0)
          }
        >
          <img src={ChevronRight} alt="Scroll Right" className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default CardsContainer;
