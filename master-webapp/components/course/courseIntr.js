/**
* 课程介绍
*  <>-----}|------------------------------->
* 
*/

import utils from "../../utils/renderUtil"

// 

class CourseIntr extends React.Component {
    constructor() {
        super()
    }
    render() {
        const store = this.props.store
        const { label, cla } = utils.renderCourseState(store);
        return <div className="course-intr disp-vertical-start">
            <span className="state fs-bold theme-bold">{store.code}.<i className={cla}>{label}</i></span>
            <h2 className="title fs-bold theme-bold">{store.title}</h2>
            <p className="desc fs-gray">简介：{store.intro}</p>
        </div>
    }
}

export default CourseIntr;
