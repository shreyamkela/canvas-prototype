import React, { Component } from "react";
import { Link, Route } from "react-router-dom";
import { connect } from "react-redux";

import { Card, Icon, Badge } from "antd";

import cardImage from "../../_public/images/courseCard.jpg";

class CourseCard extends Component {
  state = { title: "", redirect: false };

  handleLinkCLick = () => {
    // NOTE We use Link to route to the course page but have also used handle link click listener - This is because we have to manually set the state so as to tell react to rerender and route to the courses page, otherwise on clicking the link, the url changes but page does not
    this.setState({ redirect: true });
  };

  componentDidMount() {
    let titleString = `${this.props.course.courseId} - ${this.props.course.courseName}`;
    let link = `/courses/${this.props.course.courseId}`; // Ex: Endpoint for this course is /view/CMPE273
    let courseTitle = (
      // NOTE Dont use <a> for including links in react. As react uses react router to route between pages, therefore, we should only us the Link tag provided by react react. <a> tag can malfunction with react router
      <Link to={link} style={{ textDecoration: "underline" }} onClick={this.handleLinkCLick}>
        <font size="2">{titleString}</font>
      </Link>
    );
    this.setState({ title: courseTitle });
  }

  render() {
    const { Meta } = Card;
    const title = this.state.title;
    //console.log("TITLE:", title);

    return (
      <Card
        className="rounded shadow"
        style={{ width: 250 }}
        cover={<img src={cardImage} />}
        actions={[
          <a href="#">
            <Badge>
              {/** FIXME Add count display to badge */}
              <Icon type="notification" />
            </Badge>
          </a>,
          // FIXME add links to the icons
          <Icon type="form" />,
          <Icon type="folder" />
        ]}
      >
        <Meta style={{ height: 15, textAlign: "center" }} title={title} />
      </Card>
    );
  }
}

export default connect(null)(CourseCard);
