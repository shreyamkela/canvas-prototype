import React, { Component } from "react";

import { Card, Icon, Badge } from "antd";

import cardImage from "../../_public/images/courseCard.jpg";

class CourseCard extends Component {
  state = { title: "" };

  componentDidMount() {
    //console.log("This Course", this.props.course);
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
    //console.log("TITLE:", title);

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
