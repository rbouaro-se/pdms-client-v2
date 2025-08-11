import "./index.css";
import logo from "../../assets/pdms-logo.png";
import facebookIcon from "../../assets/icon-facebook.svg";
import pinterestIcon from "../../assets/icon-pinterest.svg";
import twitterIcon from "../../assets/icon-twitter.svg";
import hamburgerIcon from "../../assets/icon-hamburger.svg";
import { useEffect, useRef, useState } from "react";
import closeIcon from "../../assets/icon-close.svg";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Autoplay, Navigation, Pagination, Scrollbar } from 'swiper/modules';
import firstSlideImage from '../../assets/move3.jpg'
import secondSlideImage from '../../assets/move2.jpg'
import thirdSlideImage from '../../assets/moveMod1.jpg'
const Main = () => {
  const secondLinkRef = useRef<HTMLDivElement>(null);

  const scrollToSecondLink = () => {
    if (secondLinkRef.current !== null) {
      secondLinkRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const [text, setText] = useState("");
  const introText = "Find the best ";
  const [showPacker, setShowPacker] = useState(false);

  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= introText.length) {
        setText(introText.substring(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100);

    return () => clearInterval(typingInterval);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setShowPacker(true);
    }, 2000);
  }, []);


  useEffect(() => {
    const elements = document.querySelectorAll(".delivering-box");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    });

    elements.forEach((element) => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const introductoryMessage = document.querySelector(".intro-message-a");

    setTimeout(() => {
      introductoryMessage?.classList.add("visibleX");
    }, 2000);
  }, []);

  useEffect(() => {
    const teamSection = document.querySelectorAll(".animation");
    const teamObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visibleY");
        }
      });
    });

    teamSection.forEach((section) => teamObserver.observe(section));
    return () => teamObserver.disconnect();
  }, []);

  const [phoneMenu, setPhoneMenu] = useState(false);

  return (
    <>

      <div className="container-landing">
        <>
          <Swiper
            className="mySwiper"
            modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
            allowTouchMove={true}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            pagination={true}
          >
            <SwiperSlide >
              <img src={secondSlideImage} alt="slide2" /></SwiperSlide>
            <SwiperSlide><img src={firstSlideImage} alt="slide2" /></SwiperSlide>
            <SwiperSlide><img src={secondSlideImage} alt="slide2" /></SwiperSlide>
            <SwiperSlide><img src={thirdSlideImage} alt="slide2" /></SwiperSlide>
          </Swiper>
        </>
        <div className="main-header absolute top-0 z-20 w-full">
          <a href="#" className=" rounded-lg">
            {" "}
            <img src={logo} alt="logo" className="main-logo" />
          </a>
          <div>
            <a href="#" className="nav-buttons">
              home
            </a>
            <a href="#" className="nav-buttons" onClick={scrollToSecondLink}>
              about
            </a>
          </div>

          <div className="to-the-end">
            <a href="/authentication/login">
              {" "}
              <button className="first-button"> Log In </button>
            </a>
          </div>

          <div className="hamburger" onClick={() => setPhoneMenu(true)}>
            <img src={hamburgerIcon} alt="hamburgur Icon" />
          </div>
        </div>
        <div>

        </div>

        <div className="main-body">
          <div className="first-body">
            <div className="second-body">
              <section className="intro-a">
                <h2 className="intro-title-a">
                  <span className="typing-text">{text}</span>
                  <span className="orange"> {showPacker && "Packer"}</span>
                </h2>
                <div className="intro-message-a ">
                  Finding skilled individuals and assembling efficient teams to
                  handle your packing needs can be a daunting task. Many
                  overlook the vast pool of global talent available for such
                  services. We're here to revolutionize the packing experience
                  for you.
                </div>
              </section>
              <section className="team animation">
                <h2 className="team-intro">
                  Build & manage distributed teams like no one else.
                </h2>

                <div className="team-boxes">
                  <div className="team-box">
                    <div className="icon-person"> </div>
                    <div className="team-message">
                      <div className="team-title">Experienced Individuals</div>
                      <div className="team-message">
                        Our network is made up of highly experienced
                        professionals who are passionate about what they do.
                      </div>
                    </div>
                  </div>

                  <div className="team-box">
                    <div className="icon-set"> </div>
                    <div className="team-message">
                      <div className="team-title">Easy to Implement</div>
                      <div className="team-message">
                        Our processes have been refined over years of
                        implementation meaning our teams always deliver.
                      </div>
                    </div>
                  </div>

                  <div className="team-box">
                    <div className="icon-chart"> </div>
                    <div className="team-message">
                      <div className="team-title">Enhanaced Prouctivity</div>
                      <div className="team-message">
                        Our customized platform with in-built analytics helps
                        you manage your distributed packers.
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <section className="delivering">
                <h2 className="= delivering-intro">
                  Want to join our team of{" "}
                  <span className="success">Packers?</span>
                </h2>

                <div className="delivering-boxes">
                  <div className="delivering-box">
                    <div className="delivering-text">
                      Initiate the registration journey by visiting our
                      user-friendly login page, where you'll find the inviting
                      "Sign Up" button beckoning you to begin your adventure.
                    </div>
                    <div className=" delivering-autor">Step 1 </div>
                    <div className="delivering-autor-title">
                      Embark on Your Journey
                    </div>
                    <div className="delivering-autor-avator">
                      {/* <img  className='img'src="./assets/avatar-kady.jpg" alt='Kady,Production Manager'/>       */}
                    </div>
                  </div>

                  <div className="delivering-box">
                    <div className="delivering-text">
                      As you progress through the registration flow, take a
                      moment to select the account type that aligns with your
                      aspirations. Opt for the empowering role of "Packer,"
                      reflecting your desire.
                    </div>

                    <div className=" delivering-autor">Step 2</div>
                    <div className="delivering-autor-title">
                      Define Your Role
                    </div>
                    <div className="delivering-autor-avator">
                      {/* <img  className='img' src="./assets/avatar-aiysha.jpg" alt='Aiysha, Founder of Manage' />       */}
                    </div>
                  </div>

                  <div className="delivering-box">
                    <div className="delivering-text">
                      In the subsequent step, tailor your experience further by
                      indicating your preferred location to be a packer.This
                      selection positions you to receive orders of those who
                      need packers.
                    </div>

                    <div className=" delivering-autor">Step 3</div>
                    <div className="delivering-autor-title">
                      Select Your Zone
                    </div>
                    <div className="delivering-autor-avator">
                      {/* <img  className='img' src="./assets/avatar-arthur.jpg" alt='Aurthor, Co-founder' />       */}
                    </div>
                  </div>
                </div>
              </section>

              <section className="intro bg-[#002147]  ">
                <h2
                  className="intro-title justify-center flex items-center mt-3 sm:mt-0 animation"
                  ref={secondLinkRef}
                >
                  About
                </h2>
                <div className="intro-text pt-6 sm:pt-0">
                  <span className="success">Befako</span> is a trusted platform
                  connecting customers with reliable packers for seamless moving
                  experiences. At
                  <span className="success"> Befako</span>, we understand the
                  stress and hassle often associated with packing and moving
                  items from one place to the other, which is why we've made it
                  our mission to simplify the process. Whether you're moving
                  across town or across the country, our platform serves as your
                  one-stop destination for finding dedicated packers ready to
                  assist you every step of the way. Our commitment to quality
                  ensures that every packer in our network is thoroughly vetted,
                  guaranteeing professionalism and peace of mind for our
                  customers.
                  <br />
                  Joining
                  <span className="success"> Befako</span> not only benefits
                  customers in need of moving assistance but also offers
                  opportunities for packers seeking meaningful work. As a
                  packer, you'll have the chance to showcase your skills and
                  make a positive impact in people's lives by helping them
                  transition to new spaces with ease. With our user-friendly
                  registration process, becoming a packer is quick and
                  straightforward. Plus, our platform enables you to connect
                  with customers no matter where you are, ensuring that your
                  expertise is accessible to those in need across various
                  locations. Join <span className="success"> Befako</span> today
                  and be part of a community dedicated to simplifying moving
                  experiences for everyone involved.
                </div>
              </section>
              <section className="get-started">
                <h2 className="get-started-text"> Ready to get started?</h2>
                <a href="/authentication/signUp">
                  <button className="dark"> Sign Up </button>
                </a>
              </section>
            </div>
          </div>
        </div>

        <div className="main-footer">
          <div className="main-footer-logo">
            <img src={logo} alt="logo" className="w-16" />
          </div>
          <div className="main-footer-links">
            {/* <a href="index.html" className="link">
              {" "}
              home
            </a>
            <a href="#" className="about-footer" >
              {" "}
              about
            </a> */}
          </div>
          <div className="main-footer-address">
            "987 Hillcrest Lane"
            <br />
            " Irvine, CA"
            <br />
            "California 92714"
            <br />
            "Call Us : 949-833-7432"
          </div>
          <div className="main-footer-social">
            <a className="social-icons" href="#">
              <img src={facebookIcon} alt="Facebook" />
            </a>
            <a className="social-icons" href="#">
              <img src={pinterestIcon} alt="Pinterest" />
            </a>
            <a className="social-icons" href="#">
              <img src={twitterIcon} alt="Twitter" />
            </a>
          </div>
          <div className="main-footer-copy">
            Copyright 2024. All Rights Reserved.
          </div>
        </div>

        {phoneMenu && (
          <div className="mobile-menu-container">
            <div className="mobile-menu-backcloth"></div>
            <div className="mobile-menu">
              <div className="mobile-menu-header">
                <div className="btn-close" onClick={() => setPhoneMenu(false)}>
                  <a href="#">
                    <img src={closeIcon} alt="close" />
                  </a>
                </div>
              </div>
              <div className="mobile-menu-body">
                <a href="#" className="mob">
                  home
                </a>
                <a
                  href="#"
                  onClick={() => {
                    scrollToSecondLink();
                    setPhoneMenu(false);
                  }}
                >
                  {" "}
                  about
                </a>
                <a href="/authentication/login">
                  <button className="mob-b"> Log In</button>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Main;
