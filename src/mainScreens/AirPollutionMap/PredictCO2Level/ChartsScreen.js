import React, { useState } from 'react';
import { View, Dimensions, ScrollView, Text, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import COLORS from '../../../consts/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from "../../components/Header";
import { useNavigation } from '@react-navigation/native';

const ChartsScreen = ({ route }) => {
  const { result } = route.params;
  const { co2Levels, timeStamps } = result;
  console.log("\n\ntimeStamps:", timeStamps);

  const navigation = useNavigation();
  const uniqueDates = [...new Set(timeStamps.map(ts => ts.split('T')[0]))];
  // console.log("uniqueDates: ", timeStamps);

  const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'];

  const [tooltipPos, setTooltipPos] = useState({ visible: false, x: 0, y: 0, value: 0 });

  return (
    <View style={{ backgroundColor: COLORS.backgroundColor, height: "100%" }}>
      <ScrollView>
        <Header navigation={navigation} title={"CO2 Level Result"} />
        {uniqueDates.map((date, dateIndex) => {
          const dateCon = new Date(timeStamps[dateIndex]);
          const dayData = co2Levels.filter((_, idx) => timeStamps[idx].startsWith(date));
          const formattedTime = dateCon.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          return (
            <View key={date} style={{ marginBottom: 24, marginTop: 20, paddingLeft: 30 }}>
              <Text style={styles.topTitle}>{date}-{formattedTime}</Text>
              <ScrollView horizontal>
                <LineChart
                  data={{
                    labels: Array.from({ length: 24 }, (_, i) => i.toString()),
                    datasets: [
                      {
                        data: dayData,
                        color: () => colors[dateIndex % colors.length],
                        strokeWidth: 2,
                      },
                    ],
                  }}
                  width={Dimensions.get('window').width * 2}
                  height={220}
                  chartConfig={{
                    backgroundColor: '#ffffff',
                    backgroundGradientFrom: '#ffffff',
                    backgroundGradientTo: '#ffffff',
                    decimalPlaces: 2,
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                      borderRadius: 16,
                    },
                    propsForDots: {
                      r: '6',
                      strokeWidth: '2',
                      stroke: '#ffa726',
                    },
                  }}
                  bezier
                  style={{
                    marginVertical: 8,
                    borderRadius: 16,
                  }}
                  onDataPointClick={(data) => {
                    const isSamePoint = (tooltipPos.x === data.x && tooltipPos.y === data.y);

                    setTooltipPos((prevState) => ({
                      x: data.x,
                      y: data.y,
                      value: data.value,
                      visible: !isSamePoint || !prevState.visible,
                    }));
                  }}
                />
                {tooltipPos.visible && (
                  <View
                    style={{
                      position: 'absolute',
                      top: tooltipPos.y - 10,
                      left: tooltipPos.x + 10,
                      backgroundColor: '#fff',
                      padding: 5,
                      borderRadius: 5,
                      borderColor: '#ccc',
                      borderWidth: 1,
                    }}
                  >
                    <Text style={{ color: '#000' }}>{tooltipPos.value}</Text>
                  </View>
                )}
              </ScrollView>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default ChartsScreen;

const styles = StyleSheet.create({
  topTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingTop: 10,
    textAlign: 'center',
    color: COLORS.darkGreen,
    marginBottom: 20
  },
});
