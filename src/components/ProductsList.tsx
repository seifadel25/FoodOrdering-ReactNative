import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import { Product } from "@/types";
import { Link } from "expo-router";

export const defaultPizzaImg =
  "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/default.png";

type ProductsListProps = {
  product: Product;
};

const ProductsList = ({ product }: ProductsListProps) => {
  return (
    <Link href={`/menu/${product.id}`} asChild>
      <Pressable style={styles.container}>
        <Image
          source={{ uri: product.image || defaultPizzaImg }}
          style={styles.img}
        />
        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.price}>{(product.price * 10).toFixed(1)} EGP</Text>
      </Pressable>
    </Link>
  );
};
export default ProductsList;
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    flex: 1,
    maxWidth: "50%",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginVertical: 10,
  },
  price: {
    fontSize: 18,
    color: "teal",
    fontWeight: "500",
  },
  img: {
    width: "100%",
    aspectRatio: 1,
    resizeMode: "contain",
  },
});