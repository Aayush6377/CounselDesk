import { FaStar, FaStarHalf } from "react-icons/fa";

const renderRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`star-${i}`} className="text-yellow-400 text-sm" />);
    }

    if (hasHalfStar) {
      stars.push(<FaStarHalf key="star-half" className="text-yellow-400 text-sm" />);
    }

    while (stars.length < 5) {
      stars.push(<FaStar key={`empty-${stars.length}`} className="text-gray-600 text-sm" />);
    }

    return stars;
};

export default  renderRating;