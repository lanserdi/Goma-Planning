import './index.scss';
import Planning from './planning';

document.querySelector('#app').innerHTML = '<div id="elePlanning" style="margin: 0 auto;"></div>';

const planningInstance = new Planning({
  eleWrap: document.querySelector('#elePlanning'),
  navBarColor: '#fff',
  onSendTask: function (value, cb) {
    console.log(this)
    console.log('send...be -> ' + value)
    cb()
  },
  cardsProp: [
    {
      title: '待完成',
      defaultColor: '#666',
      activeColor: '#0074d0',
      tasks: [
        {
          title: '撸起袖子，加油干！'
        },
      ],
    },
    {
      title: '已完成',
      defaultColor: '#666',
      activeColor: '#009688',
      tasks: [
        {
          title: '撸起袖子，加油干！'
        },
        {
          title: '撸起袖子，加油干！'
        },
      ],
    },
    {
      title: '回收站',
      defaultColor: '#666',
      activeColor: '#d05047',
      tasks: [
        {
          title: '撸起袖子，加油干！'
        },
        {
          title: '撸起袖子，加油干！'
        },
        {
          title: '撸起袖子，加油干！'
        },
      ],
    }
  ]
});