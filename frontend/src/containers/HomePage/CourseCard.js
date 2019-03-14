import React, { Component } from "react";

import { Card, Icon, Badge } from "antd";

import cardImage from "../../_public/images/courseCard.jpg";

class CourseCard extends Component {
  state = { title: "" };

  constructor() {
    super();
    // this.setState({ title: "Enter Title" }); // Setting the state in constructor does not work as the CourseCard component is being use as a child under dashboard component, and the card component does not re render when we use setState in its constructor. First courseCard is mounted and the state title is "". Then we have to use componentDidMount to change the state.
  }

  componentDidMount() {
    console.log("This Course", this.props.course);
    let titleString = `${this.props.course.Id} - ${this.props.course.Name}`;
    let link = `/courseview/${this.props.course.Id}`; // Ex: Endpoint for this course is /view/CMPE273
    let courseTitle = (
      <a href={link}>
        <font size="2">{titleString}</font>
      </a>
    );
    this.setState({ title: courseTitle });
  }

  render() {
    const { Meta } = Card;
    const title = this.state.title;
    console.log("TITLE:", title);

    return (
      <Card
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

export default CourseCard;
