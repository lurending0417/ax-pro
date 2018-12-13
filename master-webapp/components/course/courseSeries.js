import CourseItem from "./courseItem";

// 

class CourseSeries extends React.PureComponent {
    render() {
        return <div style={{ marginTop: 0 }} className="home-course-box">
            <ul>
                {this.props.sections.map((item, index) => {
                    return this.renderSerItem(item, index)
                })}
            </ul>
        </div>
    }

    renderSerItem = (item, index) => {
        return <CourseItem onClick={this.props.onItemClick} key={"c" + item.id} data={item} index={index} />
    }
}

export default CourseSeries;