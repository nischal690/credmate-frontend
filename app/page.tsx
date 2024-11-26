import AppBar from './components/AppBar';
import NewsCarousel from './components/NewsCarousel';
import CreditScoreContainer from './components/CreditScoreContainer';
import RecentActivity from './components/RecentActivity';
import NavBar from './components/NavBar';

export default function Home() {
  return (
    <div className="mobile-container">
      <div className="content-container">
        <AppBar />
        <NewsCarousel />
        <CreditScoreContainer />
        <RecentActivity />
        <NavBar />
      </div>
    </div>
  );
}