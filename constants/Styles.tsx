import styled from 'styled-components/native';
import { lightMono, darkMono, compliment, mainColor, offWhite } from './Colors'
import { ViewProps, TextProps, TextInputProps, TouchableOpacityProps} from 'react-native';
import { Dimensions } from "react-native";

var deviceWidth = Dimensions.get("window").width;
var deviceHeight = Dimensions.get("window").height;


interface HeadFootProps extends ViewProps{
  backgroundColor?: string;
  lRadius?: number;
  rRadius?: number;
  
};

export const Header = styled.View<HeadFootProps>`
  justify-content: center;
  align-items: center;
  flex: ${props => props.flex || 2};
  background-color: ${props => props.backgroundColor || offWhite};
  border-bottom-right-radius: ${props => props.rRadius  || 50}px;
  border-bottom-left-radius:  ${props => props.lRadius  || 50}px;
`;

export const Footer = styled.View<HeadFootProps>`
  flex: ${props => props.flex|| 4};
  border-top-right-radius: ${props => props.rRadius || 50}px;
  border-top-left-radius: ${props => props.lRadius || 50}px;
  background-color: ${props => props.backgroundColor || offWhite};
  justify-content: center;
  align-items: center;
`;

interface ContainerProps extends ViewProps {
  backgroundColor?: string;
};

export const Container = styled.View<ContainerProps>`
  background-color:  ${props => props.backgroundColor || mainColor};
  height: ${deviceHeight * 97 / 100};
  width: ${deviceWidth * 100 / 100};
`;

interface DivProps extends ViewProps{
    backgroundColor?: string;
    radius?: number;
    margin?: number;
    padding?: number;
    flex?: number;
    height?: number;
    justify?: string;
    align?: string;
};

export const Div = styled.View<DivProps>`
  background-color: ${props => props.backgroundColor || compliment};
  border-radius: ${props => props.radius || 0}px;
  margin: ${props => props.margin || 0}px;
  padding: ${props => props.padding|| 10}px;
 
`;

interface Props extends TextProps {
    fontSize?: number;
    color?: string;
    justify?: string;
    backgroundColor?: string;
    radius?: number;
    margin?: number;
};

export const BigText = styled.Text<Props>`
    font-size: ${props => props.fontSize || 30}px;
    text-align:  ${props => props.justify || 'center'};
    color:  ${props => props.color || lightMono};
    font-weight: bold;
    margin: ${props => props.margin || 0}px;
    font-variant: small-caps;
`;

export const Text = styled.Text<Props>`
    font-size: ${props => props.fontSize || 20}px;
    text-align:  ${props => props.justify || 'center'};
    color:  ${props => props.color || lightMono};
`;

interface InputProps extends TextInputProps {
    color?: string
};

export const Input = styled.TextInput<InputProps>`
    color:  ${props => props.color || lightMono};
    
    
    padding: 15px;
    
    border-Radius: 5px;
    background-color:${props => props.backgroundColor || darkMono};
`;


interface BreakProps extends ViewProps {
    lineColor?: string;
    spacing?: number;
    width?: number;
    thickness?: number
};

export const Linebreak = styled.View<BreakProps>`
    border-bottom-color: ${props => props.lineColor ||lightMono};
    border-bottom-width: ${props => props.thickness || 1}px;
    margin-top: ${props => props.spacing || 20}px;
    margin-bottom: ${props => props.spacing || 20}px;
    shadow-color: gray;
    shadow-opacity: 0.2;
    shadow-radius: 2;
    elevation: 4;
    width: ${props => deviceWidth * (props.width)/100 || deviceWidth * 50/100};
`;

interface ButtonProps extends TouchableOpacityProps {
  color?: string,
  width?: number,
  disabled?: boolean,
  backgroundColor?: string,
};

export const Button = styled.TouchableOpacity<ButtonProps>`
    width: ${props =>props.width|| 90}%;
    background-color: ${props => props.backgroundColor || darkMono};
    borderRadius: 30px;
    border-width: 1;
    border-color:  ${props => props.disabled ? compliment : props.color || mainColor };
    border-bottom-width: 0;
    shadow-color: black;
    shadow-opacity: .2;
    shadow-radius: 2px;
    elevation: 9;
`;