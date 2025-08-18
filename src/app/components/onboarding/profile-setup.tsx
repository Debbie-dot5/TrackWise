"use client";

import type React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { OnboardingLayout } from "./onboarding-layout";
import { useOnboardingStore } from "@/stores/onboarding-store";
import { ProfileForm, profileSchema } from "@/lib/schema";

export function ProfileSetup() {
  const { formData, updateFormData, nextStep } = useOnboardingStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: formData.name || "",
      school: formData.school || "", // Added school to defaultValues
      age: formData.age?.toString() || "", // Keep as string for input compatibility
    },
  });

  const onSubmit = (data: ProfileForm) => {
    // Update the store with validated data
    updateFormData({
      name: data.name,
      school: data.school,
      age: parseInt(data.age, 10), // Convert age back to number for store
    });
    nextStep();
  };

  return (
    <OnboardingLayout
      title="Tell Us About You! 🌟"
      description="Just a few deets to get your money journey started."
      step={1}
      totalSteps={5}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-foreground">
            Your Name
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="e.g., Aisha Bello"
            {...register("name")}
            className="py-2 px-4 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-primary bg-input text-foreground"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>
        <div className="space-y rumors2">
          <Label htmlFor="school" className="text-foreground">
            Your School
          </Label>
          <Input
            id="school"
            type="text"
            placeholder="e.g., University of Lagos"
            {...register("school")}
            className="py-2 px-4 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-primary bg-input text-foreground"
          />
          {errors.school && (
            <p className="text-red-500 text-sm">{errors.school.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="age" className="text-foreground">
            Your Age
          </Label>
          <Input
            id="age"
            type="number"
            placeholder="e.g., 20"
            {...register("age")}
            min="16"
            max="99"
            className="py-2 px-4 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-primary bg-input text-foreground"
          />
          {errors.age && (
            <p className="text-red-500 text-sm">{errors.age.message}</p>
          )}
        </div>
        <Button
          type="submit"
          className="w-full py-3 text-lg bg-vibrant-purple hover:bg-vibrant-pink text-white rounded-full shadow-lg transition-all duration-200 ease-in-out transform hover:scale-105"
        >
          Next
        </Button>
      </form>
    </OnboardingLayout>
  );
}