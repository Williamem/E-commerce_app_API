import React from 'react';
import { Link } from 'react-router-dom';
import drPhil from './nedladdning.jpeg'

function Home() {
  return (
    <div>
        <div className='home-content'>
          <div className='home-col-1'>
            <img src={drPhil} className='home-image' alt='Dr. Phil'></img>
            <Link to={'/products'} className='cta-btn'>Check out our products!</Link>
          </div>
        <div>
          <h1>Home Page - Welcome to the E-commerce App</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam dictum mollis gravida. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas varius efficitur nisl, eget gravida nulla maximus quis. Donec volutpat ullamcorper congue. Pellentesque et ultricies elit, ac placerat neque. Aliquam auctor ultricies nulla aliquam lobortis. Aliquam in volutpat dui, ac cursus ex. Vestibulum ac orci ultricies, porttitor ipsum eget, condimentum odio.
          </p>
          <p>
            Mauris vel ipsum quam. Nunc neque nulla, facilisis non augue quis, consequat viverra enim. Vivamus quis sapien ligula. Cras rutrum, neque sit amet tempor laoreet, orci leo scelerisque diam, et ultricies nisl urna sed ipsum. Proin nec porttitor dui. Quisque et mi condimentum, congue erat sit amet, blandit metus. Ut non magna vitae ex aliquam euismod id sit amet magna. Quisque posuere sapien ut mi malesuada, eu dictum ligula vulputate. Aliquam tincidunt, dui et accumsan varius, nulla ante ornare erat, et pellentesque magna leo id arcu. Maecenas a leo laoreet, aliquet massa at, pellentesque quam. Integer quis luctus tortor. Mauris quis pellentesque lectus. Etiam ultricies mattis metus nec varius. Maecenas sagittis tempor eros sed auctor.
          </p>
        </div>
      </div>
    </div>
    );
}

export default Home;