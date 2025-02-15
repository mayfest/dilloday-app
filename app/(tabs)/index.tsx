import React from 'react';
import { Image, Text, View } from 'react-native';
import Horse from '../../assets/images/horsescarousel.svg';
import { Colors } from '../../constants/Colors';



interface SplitBoxProps {
  color: string;
  // padding: number;
  size: number;
  title?: string;
  time?: string;
  location?: string;
  imageSrc?: string;
}

function SplitBox({ color, size, title, time, location, imageSrc }: SplitBoxProps) {
  return (
    <View
      style={{
        backgroundColor: color,
        width: 350,
        height: size,
        borderRadius: 6,
        marginVertical: 10,
        overflow: 'hidden',
        flexDirection: 'row', 
      }}
    >
      {
        <>
          <Image
            source={{ uri: imageSrc }}
            style={{
              width: '40%',
              height: '100%',
            }}
            resizeMode='cover'
          />
          <View
            style={{
              width: '60%', // start from left side of box
              justifyContent: 'center',
              alignItems: 'flex-start',
              padding: 15,
            }}
          >
            {/* FOR THE TITLE */}
            <Text
              style={{
                color: Colors.light.text,
                textAlign: 'left',
                // fontFamily: 'SpaceMono-Bold',
                fontSize: 18,
                fontWeight: 'bold',
              }}
            >
              {title}
            </Text>
              {/* FOR THE LOCATION AND TIME */}
            <Text
              style={{
                color: Colors.light.text,
                textAlign: 'left',
                // fontFamily: 'SpaceMono-Regular',
                fontSize: 14,
              }}
            >
              {time + '\n'}
              {location}
            </Text>
          </View>
        </>
      }
    </View>
  );
}

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', backgroundColor: Colors.light.background, padding: 60 }}>
      {/* DILLO DAY TITLE*/}
      <Horse width={150} height={90}/>

      <Text style={{ 
        // position: 'absolute',
        color: '#ffff', 
        marginTop: -10,
        marginBottom: 10,
        // fontFamily: 'SpaceMono-Bold',
        // left: -80,
        textAlign: 'center',
        fontSize: 30
        }}>CARNIVAL DILLO</Text>
        
      
      {/* CURRENT ARTIST INFORMATION
          CURRENT MAIN STAGE AND CURRENT SECOND STAGE
      */}
      {SplitBox({ color: Colors.light.cardAlt, 
        size: 115, 
        title:'THE DARE',
        time: '2:00pm',
        location: 'Main Stage',
        imageSrc: 'https://b3142227.smushcdn.com/3142227/wp-content/uploads/2023/03/the-dare.jpeg?lossy=2&strip=1&webp=1',
        })}
      {SplitBox({ color: Colors.light.actionText, 
        size: 115, 
        title: 'TCHAIKOVSKY',
        time: '3:00pm',
        location: 'Second Stage',
        imageSrc: 'https://i.scdn.co/image/9a7c31f43e22a95f6d3c57baf4f87a3a9d2b93e0',
        })}
      
    </View>
  );
}