// import { LeftOutlined, RightOutlined } from "@ant-design/icons";
// import { Carousel } from "antd";
// import { CarouselRef } from "antd/es/carousel";
// import { useRef } from "react";

// export default function SlideShowBanner() {
//   const ref = useRef<CarouselRef>(null);
//   const handlePrevBanner = ()=>{
//     ref.current?.prev()
//   }
//   const handleNextBanner = ()=>{
//     ref.current?.next()
//   }
//   return (
//     <div className="relative">
//       <Carousel  infinite={true} ref={ref} autoplay={true} autoplaySpeed={3000} speed={1000}>
//         <div>
//           <img
//             src="https://pos.nvncdn.com/8ca22b-20641/bn/20241018_mdsPcOeq.gif"
//             alt=""
//           />
//         </div>
//         <div>
//           <img
//             src="https://pos.nvncdn.com/8ca22b-20641/bn/20241018_syJWHygY.gif"
//             alt=""
//           />
//         </div>
//       </Carousel>
//       <div onClick={handlePrevBanner} className="absolute top-[50%] left-3 text-white bg-black opacity-65 py-3 px-3 hover:opacity-85 cursor-pointer">
//         <LeftOutlined />
//       </div>
//       <div onClick={handleNextBanner} className="absolute top-[50%] right-3 text-white bg-black opacity-65 py-3 px-3 hover:opacity-85 cursor-pointer">
//         <RightOutlined />
//       </div>
//     </div>
//   );
// }
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Carousel } from "antd";
import { CarouselRef } from "antd/es/carousel";
import { useRef, useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components"; // Assuming you have styled-components installed

// Styled Components
const BannerContainer = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 4px;

  /* Custom styles for Ant Design Carousel */
  .slick-dots {
    bottom: 16px;
  }

  .slick-dots li button {
    background: white !important;
    opacity: 0.5;
    width: 8px;
    height: 8px;
    border-radius: 4px;
  }

  .slick-dots li.slick-active button {
    opacity: 1;
    width: 24px;
  }
`;

const BannerSlide = styled.div`
  height: 450px;
  width: 100%;

  @media (max-width: 768px) {
    height: 300px;
  }

  @media (max-width: 480px) {
    height: 200px;
  }
`;

const BannerImage = styled.div`
  width: 100%;
  height: 100%;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  transition: transform 0.3s ease;
`;

const NavButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 16px;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
  opacity: 0;

  ${BannerContainer}:hover & {
    opacity: 0.8;
  }

  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
    transform: translateY(-50%) scale(1.1);
  }

  @media (max-width: 768px) {
    width: 35px;
    height: 35px;
  }

  @media (max-width: 480px) {
    width: 30px;
    height: 30px;
  }
`;

const PrevButton = styled(NavButton)`
  left: 20px;
`;

const NextButton = styled(NavButton)`
  right: 20px;
`;

const LoadingPlaceholder = styled.div`
  height: 450px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  border-radius: 4px;

  @media (max-width: 768px) {
    height: 300px;
  }

  @media (max-width: 480px) {
    height: 200px;
  }
`;

const Loader = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

// If you don't want to use styled-components, you can use this CSS-in-JS approach instead
const styles = {
  carouselContainer: {
    borderRadius: "4px",
    overflow: "hidden",
  },
};

interface Banner {
  _id: string;
  imageUrl: string;
  status: boolean;
}

export default function SlideShowBanner() {
  const ref = useRef<CarouselRef>(null);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:3000/api/banners");
        // Filter to only show active banners
        const activeBanners = res.data.data.filter(
          (banner: Banner) => banner.status
        );
        setBanners(activeBanners);
      } catch (error) {
        console.error("Error fetching banners:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  const handlePrevBanner = () => {
    ref.current?.prev();
  };

  const handleNextBanner = () => {
    ref.current?.next();
  };

  // Check if banner URL is local or remote
  const getBannerUrl = (url: string) => {
    return url.startsWith("/uploads/") ? `http://localhost:3000${url}` : url;
  };

  if (loading) {
    return (
      <LoadingPlaceholder>
        <Loader />
      </LoadingPlaceholder>
    );
  }

  // If no banners are available, show a placeholder or return null
  if (banners.length === 0) {
    return null;
  }

  return (
    <BannerContainer>
      <Carousel
        infinite={true}
        ref={ref}
        autoplay={true}
        autoplaySpeed={3000}
        speed={1000}
        effect="fade"
        dots={true}
        style={styles.carouselContainer}
      >
        {banners.map((banner) => (
          <div key={banner._id}>
            <BannerSlide>
              <BannerImage
                style={{
                  backgroundImage: `url(${getBannerUrl(banner.imageUrl)})`,
                }}
              />
            </BannerSlide>
          </div>
        ))}
      </Carousel>
      {banners.length > 1 && (
        <>
          <PrevButton onClick={handlePrevBanner} aria-label="Previous banner">
            <LeftOutlined />
          </PrevButton>
          <NextButton onClick={handleNextBanner} aria-label="Next banner">
            <RightOutlined />
          </NextButton>
        </>
      )}
    </BannerContainer>
  );
}
