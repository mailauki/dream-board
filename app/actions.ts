"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { Tables } from "@/types/supabase";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required",
    );
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    return encodedRedirect(
      "success",
      "/sign-up",
      "Thanks for signing up! Please check your email for a verification link.",
    );
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/protected");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export const addItem = async (formData: FormData) => {
	const supabase = await createClient();
	const url = formData.get("url")?.toString();
	console.log(url);

	const { data: { user } } = await supabase.auth.getUser();

	const { data, error } = await supabase
	.from('dreams')
	.insert([
		{ url: url!, user_id: user?.id! },
	])
	.select('*');
	
	if (error) {
		throw error; // Throw the Supabase error to be caught
	}

	console.log(data);
	redirect("/dreams");
}

export const updateItem = async (formData: FormData) => {
	const supabase = await createClient();
	const id = formData.get("id")?.toString();
	const url = formData.get("url")?.toString();
	const title = formData.get("title")?.toString();
	const description = formData.get("description")?.toString();
	const price_amount = formData.get("price-amount")?.toString();
	const price_currency = formData.get("price-currency")?.toString();
	console.log({ id, url, title, description, price_amount, price_currency });

	function formatFormData({ url, title, description, price_amount, price_currency }:  Omit<Tables<'dreams'>, "id"| "created_at">) {
		const dataTitle = !title ? null : title;
		const dataDescription = !description ? null : description;
		const dataPriceAmount = (!price_amount || price_amount == 0) ? null : price_amount;
		const dataPriceCurrency = (!price_amount || price_amount == 0) ? null : !price_currency ? "USD": price_currency;
		
		return Object.assign({
			url,
			title: dataTitle,
			description: dataDescription,
			price_amount: dataPriceAmount,
			price_currency: dataPriceCurrency,
		});
	}

	const { data: { user } } = await supabase.auth.getUser();

	const formattedFormData = formatFormData({
		url: url!,
		title: title!,
		description: description!,
		price_amount: Number(price_amount || 0),
		price_currency: price_currency!,
		user_id: user?.id!,
	});

	console.log(formattedFormData)

	const { data, error } = await supabase
	.from('dreams')
  .update(formattedFormData)
  .eq('id', Number(id!))
	.select('*');
	
	if (error) {
		throw error; // Throw the Supabase error to be caught
	}

	console.log({data});
	redirect(`/dreams/${id}`);
}
