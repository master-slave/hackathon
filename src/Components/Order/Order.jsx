import React from 'react';
import { Layout, Spin, notification } from 'antd';
const { Content } = Layout;
import { Input, Button, Row, Col } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { switchDay, fetchMenu, saveOrder, addItem, removeItem, fetchOrders } from '../../Redux/actionCreators';

import DayTabs from './DayTabs';

class Order extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeKey: '0',
            name: localStorage.getItem('name') || '',
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.props.fetchMenu();

        if (false && this.state.name) {
        	this.props.fetchOrders(this.state.name);
    	}
    }

    componentDidUpdate(prevProps) {
    	if (prevProps.orderSaving && !this.props.orderSaving) {
    		if (this.props.orderError) {
    			notification.error({
    				message: 'Ooops, there was a problem',
    				description: 'We could not save your order. Please try again.',
    			});
    		} else {
    			notification.success({
    				message: 'Order saved',
    				description: 'Success! Enjoy your meal. Feel free to alter your order if you change your mind.',
    			});
    		}
    	}
    }

    onTabChange = (activeKey) => {
        this.setState({activeKey});
    };


    handleInputChange = event => {
        this.setState({ name: event.target.value });
    };

    handleSubmit() {
    	if (this.state.activeKey && this.state.name) {
    		this.props.saveOrder(this.state.activeKey, this.state.name);
    	}
    }

    render() {
    	if (this.props.menuLoading || this.props.orderLoading) {
    		console.log('spinning');
    		return <div style={{textAlign: 'center', paddingTop: '100px'}}>
    			<Spin size="large" />
    		</div>;
    	}

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
                                onPressEnter={this.handleSubmit}
                                autoFocus
                            />
                            <Button onClick={this.handleSubmit} className="submitOrderButton" loading={this.props.orderSaving} disabled={this.props.orderSaving || this.props.menuLoading || this.props.orderLoading || !this.state.name}>
                                Submit
                            </Button>
                        </Col>
                    </Row>
                    <DayTabs
                        onTabChange={this.onTabChange}
                        activeKey={this.state.activeKey}
                        menu={this.props.menuByDay}
                        menuAll={this.props.menuAll}
                        addFood={this.props.addItem}
                        removeFood={this.props.removeItem}
                        selectedItems={this.props.order}
                    />
                </Content>
            </Layout>
        );
    }
}

const mapStateToProps = state => {
    return {
        menuByDay: state.menu.byDay,
        menuAll: state.menu.all,
        menuLoading: state.menu.loading,
        order: state.order.items,
        orderLoading: state.order.loading,
        orderSaving: state.order.saving,
        orderError: state.order.error,
    };
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(
		{
			switchDay,
			fetchMenu,
            addItem,
            removeItem,
            saveOrder,
            fetchOrders,
		},
		dispatch
	);
};

export default connect(mapStateToProps, mapDispatchToProps)(Order);