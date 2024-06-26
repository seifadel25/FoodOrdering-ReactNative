import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React, { useEffect } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import Button from "@/components/Button";
import Colors from "@/constants/Colors";
import { useCart } from "@/providers/CartProvider";
import { PizzaSize } from "@/types";
import { useProduct } from "@/api/products";
import { defaultPizzaImg } from "@/components/ProductsList";
import RemoteImage from "@/components/RemoteImage";

const sizes: PizzaSize[] = [1, 3, 6, 12];

const product = () => {
  const { id: idString } = useLocalSearchParams();
  const id = parseInt(typeof idString === "string" ? idString : idString[0]);
  const { addItem } = useCart();
  const { data: product, error, isLoading } = useProduct(id);

  const router = useRouter();

  const [selectedSize, setSelectedSize] = useState<PizzaSize>(1);

  const [comboPrice, setcomboPrice] = useState(0);

  useEffect(() => {
    if (product) {
      setcomboPrice((product.price || 5) * (product.size || 1));
    }
  }, [product]);
  const onChangeSize = (size: PizzaSize) => {
    setSelectedSize(size);
    if (size === 1) {
      setcomboPrice((product?.price || 1) * size);
    } else if (size === 3) {
      setcomboPrice((product?.price || 3) * size - (product?.price || 3) * 0.2);
    } else if (size === 6) {
      setcomboPrice(
        (product?.price || 6) * size - (product?.price || 6) * 0.45
      );
    } else if (size === 12) {
      setcomboPrice(
        (product?.price || 12) * size - (product?.price || 12) * 1.1
      );
    }
  };

  if (!product) {
    return <Text>product not found</Text>;
  }

  const addToCart = () => {
    if (!product) return;
    console.log(comboPrice, selectedSize);

    addItem(product, comboPrice, selectedSize);
    router.push("/cart");
  };
  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        Failed to fetch Products : {error.message}
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: product.name }} />
      <View style={styles.main}>
        <RemoteImage
          path={product.image}
          fallback={defaultPizzaImg}
          style={styles.img}
        />
        <Text style={{ fontWeight: "600", fontSize: 16 }}>Select Size</Text>
        <View style={styles.sizes}>
          {sizes.map((size) => (
            <Pressable
              onPress={() => onChangeSize(size)}
              key={size}
              style={[
                styles.size,
                {
                  backgroundColor:
                    selectedSize === size ? "gainsboro" : "white",
                },
              ]}
            >
              <Text
                style={[
                  styles.sizeText,
                  { color: selectedSize === size ? "black" : "gray" },
                ]}
              >
                {size}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.end}>
        {/* <Text style={styles.price}>{(product.price * 10).toFixed(2)} EGP</Text> */}
        <Text style={styles.price}>{comboPrice} EGP</Text>

        <Button width={"100%"} text="Add to Cart" onPress={addToCart} />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    flex: 1,
    flexDirection: "column",
  },
  main: { flex: 3, overflow: "visible" },
  end: {
    // marginTop: "30%",
    flex: 1,
    justifyContent: "flex-end",
  },
  price: {
    fontSize: 18,
    color: Colors.light.tabIconDefault,
    fontWeight: "700",
  },
  img: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
    borderRadius: 20,
    overflow: "visible",
    marginBottom: 10,
  },
  sizes: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
    width: "70%",
    marginHorizontal: "auto",
  },
  size: {
    backgroundColor: "lightgrey",
    width: 50,
    aspectRatio: 1,
    padding: 10,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  sizeText: {
    fontSize: 20,
    fontWeight: "500",
  },
});
export default product;
