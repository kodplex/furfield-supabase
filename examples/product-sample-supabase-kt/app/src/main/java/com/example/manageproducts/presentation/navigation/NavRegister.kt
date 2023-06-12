package com.example.manageproducts.presentation.navigation

import androidx.navigation.NavController
import androidx.navigation.NavGraphBuilder
import androidx.navigation.compose.composable
import com.example.manageproducts.presentation.feature.addproduct.AddProductScreen
import com.example.manageproducts.presentation.feature.productdetails.ProductDetailsScreen
import com.example.manageproducts.presentation.feature.productlist.ProductListScreen

fun NavGraphBuilder.navRegistration(navController: NavController) {
    composable(ProductListDestination.route) {
        ProductListScreen(
            navController = navController
        )
    }

    composable(AddProductDestination.route) {
        AddProductScreen(
            navController = navController
        )
    }
    composable(route = "${ProductDetailsDestination.route}/{${ProductDetailsDestination.productId}}",
        arguments = ProductDetailsDestination.arguments) { navBackStackEntry ->
        val productName =
            navBackStackEntry.arguments?.getString(ProductDetailsDestination.productId)
        ProductDetailsScreen(
            productId = productName,
            navController = navController,
        )
    }

}