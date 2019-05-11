import React from "react";
import profile from "../containers/ProfilePage/Profile";
import Adapter from "enzyme-adapter-react-16";
import Enzyme, { mount, shallow } from "enzyme";

Enzyme.configure({ adapter: new Adapter() });

describe("<profile />", () => {
  it("render Profile page successfully", () => {
    const component = shallow(<profile />);
    console.log(component);
    expect(component).toHaveLength(1);
  });

  it(" Update Profile", () => {
    const component = shallow(<signUp />);
    console.log(component);
    expect(component).toMatchSnapshot();
  });
});
