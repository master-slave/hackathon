import React from 'react';
import { Layout } from 'antd';
const { Content } = Layout;
import { Input, Button, Row, Col } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import uniq from 'lodash.uniq';

import { switchDay, fetchMenu, saveOrder } from '../../Redux/actionCreators';

import DayTabs from './DayTabs';

class Order extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeKey: '0',
            name: '',
            selectedFood: {},
        };
    }

    componentDidMount() {
        this.props.fetchMenu();
    }

    onTabChange = (activeKey) => {
        this.setState({activeKey});
        // this.props.switchDay(activeKey);
    };


    handleInputChange = event => {
        this.setState({ name: event.target.value });
    };

    addFood = (day, foodId) => {
        const newSelection = {
        ...this.state.selectedFood,
                [day]: this.state.selectedFood[day] ? [...this.state.selectedFood[day], foodId] : [foodId]
        };

        this.setState({
            selectedFood: newSelection,
        });
    };

    removeFood = (day, foodId) => {
        const newSelection = {
            ...this.state.selectedFood,
            [day]: this.state.selectedFood[day].filter((id) => {
                 return id !== foodId;
            })
        };

        this.setState({
            selectedFood: newSelection,
        });
    };

    render() {
        console.log(this.state.selectedFood);
        return(
            <Layout>
                <Content>

                    <Row className="h-layoutWidth90" type="flex" justify="end" align="middle">
                        <Col span="24" className="NameFieldWrapper">
                            <Input
                                placeholder="Your name"
                                onChange={this.handleInputChange}
                                value={this.state.name}
                                className="NameField"
                            />
                            <Button onClick={this.props.saveOrder} className="submitOrderButton">
                                Submit
                            </Button>
                        </Col>
                    </Row>

                    <DayTabs
                        onTabChange={this.onTabChange}
                        activeKey={this.state.activeKey}
                        menu={this.props.menuByDay}
                        menuAll={this.props.menuAll}
                        addFood={this.addFood}
                        removeFood={this.removeFood}
                    />
                </Content>
            </Layout>
        );
    }
}

const mapStateToProps = state => {
    return {
        day: state.day,
        menuByDay: state.menu.byDay,
        menuAll: state.menu.all,
        menuLoading: state.menu.loading,
    };
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(
		{
			switchDay,
			fetchMenu,
		},
		dispatch
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(Order);