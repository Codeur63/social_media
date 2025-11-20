import { Dimensions } from "react-native";

export const {width: deviceWidth, height: deviceHeight} = Dimensions.get("window");

export const hp = percentage => Math.round((percentage * deviceHeight) / 100);
export const wp = percentage => Math.round((percentage * deviceWidth) / 100);

export const stripHtmlTags = (html) => {
    return html.replace(/<[^>]*>&?/gm,'')
} 

export const cleanText = (html) => {
  return stripHtmlTags(html).replace(/&nbsp;/g, ' ');
};


