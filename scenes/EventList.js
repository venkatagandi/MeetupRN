import React, { Component, PropTypes } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import moment from 'moment';
import RsvpList from './RsvpList';
import { getEvents } from '../helpers/api';


export default class EventList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      events: [],
    };
    this.goToEvent = this.goToEvent.bind(this);
  }

  static propTypes = {
    navigator: PropTypes.object.isRequired,
  }

  componentWillMount() {
    getEvents().then(events => this.setState({ events }));
  }

  goToEvent(event) {
    this.props.navigator.push({
      component: RsvpList,
      title: '',
      passProps: {
        eventId: event.id,
        eventName: event.name,
        yesCount: event.yes_rsvp_count,
      },
    });
  }

  render() {
    const { events } = this.state;
    const eventList = (status) => events
      .filter(event => event.status === status)
      .sort((a, b) => b.time - a.time)
      .map(item =>
        <View style={styles.eventContainer} key={item.id}>
          <TouchableOpacity style={styles.event} onPress={() => this.goToEvent(item)}>
            <Text style={styles.eventInfo}>{moment(item.time+item.utc_offset).utc().format('dddd, MMM D, h:mm A')}</Text>
            <Text style={styles.eventName}>{item.name}</Text>
            <Text style={styles.eventInfo}>{item.yes_rsvp_count} {item.yes_rsvp_count > 1 ? 'Members' : 'Member'}</Text>
          </TouchableOpacity>
        </View>
      );

    return (
      <View style={styles.container}>
        <ScrollView style={styles.eventList}>
          <Text style={styles.headerTwo}>UPCOMING</Text>
          <View style={styles.eventOuter}>{eventList('upcoming')}</View>
          <Text style={styles.headerTwo}>PAST</Text>
          <View style={styles.eventOuter}>{eventList('past')}</View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  eventOuter: {
    borderTopWidth: 1,
    borderTopColor: '#bbb',
  },
  eventContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#bbb',
    backgroundColor: 'white',
  },
  event: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    justifyContent: 'center',
  },
  eventInfo: {
    fontSize: 12,
    color: '#888',
  },
  eventName: {
    fontSize: 16,
    lineHeight: 22,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  headerTwo: {
    color: '#777',
    fontWeight: 'bold',
    marginLeft: 10,
    marginTop: 14,
    marginBottom: 2,
  },
});
