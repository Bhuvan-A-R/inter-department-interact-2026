"use client";

import React, { useEffect, useState } from "react";
import { useForm, FieldErrors } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { ArrowLeft, Save } from "lucide-react";
import { Event } from "@/app/register/addRegistrant/page";
import { participantFormSchema } from "@/lib/schemas/register";

type SelectRolesAndEventsProps = {
  allEvents: Event[];
};

export default function SelectRolesAndEvents({
  allEvents,
}: SelectRolesAndEventsProps) {
  const router = useRouter();
  const [selectedEvents, setSelectedEvents] = useState<
    {
      eventId: string;
      eventNo: number;
      eventName: string;
      teamNumber?: number | null;
      type: "PARTICIPANT";
    }[]
  >([]);
  const [disabled, setDisabled] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<z.infer<typeof participantFormSchema>>({
    resolver: zodResolver(participantFormSchema),
    defaultValues: {
      name: "",
      usn: "",
      phone: "",
      events: [],
      email: "",
      gender: null,
      blood: null,
    },
  });

  useEffect(() => {
    setValue("events", selectedEvents);
  }, [selectedEvents, setValue]);

  const onToggleSelect = (event: Event) => {
    setSelectedEvents((prev) => {
      const idx = prev.findIndex((item) => item.eventId === event.id);
      if (idx >= 0) {
        return prev.filter((item) => item.eventId !== event.id);
      }
      return [
        ...prev,
        {
          eventId: event.id,
          eventName: event.eventName,
          eventNo: event.eventNo,
          teamNumber: event.teamNumber ?? null,
          type: "PARTICIPANT",
        },
      ];
    });
  };

  const onParticipantSubmit = async (
    data: z.infer<typeof participantFormSchema>,
  ) => {
    const payload = {
      ...data,
    };
    setDisabled(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to register");
      }
      toast.success("Registered Successfully.");
      router.push("/register/getallregister");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || "An error occurred.");
      }
    } finally {
      setDisabled(false);
    }
  };

  const onParticipantError = (
    err: FieldErrors<z.infer<typeof participantFormSchema>>,
  ) => {
    console.log("Validation Error:", err);
    toast.error("Please fix the validation errors and try again.");
  };

  const groupedEvents = allEvents.reduce(
    (acc, ev) => {
      acc[ev.category] = acc[ev.category] || [];
      acc[ev.category].push(ev);
      return acc;
    },
    {} as Record<string, Event[]>,
  );

  const formatEventLabel = (event: Event) => {
    const dept = event.deptCode ? ` ${event.deptCode}` : "";
    const team = event.teamNumber ? ` Team ${event.teamNumber}` : "";
    return `${event.eventName}${dept}${team}`.trim();
  };

  return (
    <Card className="shadow-xl w-full px-10">
      <form onSubmit={handleSubmit(onParticipantSubmit, onParticipantError)}>
        <CardHeader>
          <CardTitle className="text-center text-[#D32F23] font-bold">
            Register (Participant)
          </CardTitle>
          <CardDescription className="text-center text-[#F4D03F] font-bold">
            Add details for Participant
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4 md:gap-10">
              <div className="w-full md:w-1/3 space-y-1.5">
                <Label htmlFor="name">
                  Name of the student (As mentioned on 10th or any equivalent
                  marks card) <small className="text-red-600">*</small>
                </Label>
                <Input
                  {...register("name")}
                  id="name"
                  placeholder="Full Name - will be printed in your certificate"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>
              <div className="w-full md:w-1/3 space-y-1.5 mt-6">
                <Label htmlFor="usn">
                  USN of the Student <small className="text-red-600">*</small>
                </Label>
                <Input
                  {...register("usn")}
                  id="usn"
                  placeholder="University Seat Number"
                />
                {errors.usn && (
                  <p className="text-red-500 text-sm">{errors.usn.message}</p>
                )}
              </div>
              <div className="w-full md:w-1/3 space-y-1.5 mt-6">
                <Label htmlFor="phone">
                  Phone number of the student{" "}
                  <small className="text-red-600">*</small>
                </Label>
                <Input
                  id="phone"
                  placeholder="Phone Number"
                  {...register("phone")}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm">{errors.phone.message}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 md:gap-10 w-full">
              <div className="w-1/3 md:w-1/3 space-y-1.5 mt-6 w-full">
                <Label htmlFor="gender">
                  Gender of the student{" "}
                  <small className="text-red-600">*</small>
                </Label>
                {/* <Select
                  {...register("gender")}
                  onValueChange={(value) => setValue("gender", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Gender</SelectLabel>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <p className="text-red-500 text-sm">
                    {errors.gender.message}
                  </p>
                )} */}
              </div>

              <div className="w-full md:w-1/3 space-y-1.5 mt-6">
                <Label htmlFor="blood">
                  Date of Birth <small className="text-red-600">*</small>
                </Label>
                <Input
                  type="date"
                  {...register("blood")}
                  id="blood"
                  name="blood"
                  className="w-full"
                  placeholder="Enter the date of birth"
                />
                {errors.blood && (
                  <p className="text-red-500 text-sm">{errors.blood.message}</p>
                )}
              </div>

              <div className="w-full md:w-1/3 space-y-1.5 mt-6">
                <Label htmlFor="email">
                  Email <small className="text-red-600">*</small>
                </Label>
                <Input
                  {...register("email")}
                  id="email"
                  name="email"
                  placeholder="Enter the email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-card text-card-foreground p-4 rounded-md">
            <h2
              className="text-2xl font-semibold text-foreground mb-4"
              aria-label="Available events"
              tabIndex={0}
            >
              Select the events that you are Participating in
            </h2>
            <h2
              className="text-xl font-semibold text-foreground mb-4"
              aria-label="Available events"
              tabIndex={0}
            >
              Click on the event tile to confirm selection of the event
            </h2>

            {allEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground" role="status">
                No available events.
              </p>
            ) : (
              <Accordion type="single" collapsible className="w-full">
                {Object.entries(groupedEvents).map(([category, events]) => (
                  <AccordionItem key={category} value={category}>
                    <AccordionTrigger>{category}</AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-1.5">
                        {events.map((event) => {
                          const selectedObj = selectedEvents.find(
                            (item) => item.eventId === event.id,
                          );
                          const isSelected = !!selectedObj;
                          return (
                            <div
                              key={event.id}
                              role="button"
                              tabIndex={0}
                              aria-pressed={isSelected}
                              onClick={() => onToggleSelect(event)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  onToggleSelect(event);
                                }
                              }}
                              className={`p-4 border-2 rounded-lg cursor-pointer transition duration-300 flex flex-col h-full ${
                                isSelected
                                  ? "border-primary bg-primary/10"
                                  : "border-border bg-card"
                              }`}
                            >
                              <h3 className="text-lg font-semibold mb-2">
                                {formatEventLabel(event)}
                              </h3>
                              <div className="mt-auto flex items-end justify-between">
                                <div>
                                  <p className="text-sm">
                                    Max Participants: {event.maxParticipant}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
            {errors.events && (
              <p className="text-red-500 text-sm">{errors.events.message}</p>
            )}
          </div>

          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-4">Upload Documents</h2>
            <p className="mb-4 text-muted-foreground text-red-500">
              <span className="font-semibold text-red-600">Note:</span> Students
              are required to submit valid documents for verification. All
              documents must be uploaded in{" "}
              <span className="text-red-600 font-bold">PNG or JPG</span> format,
              with a file size not exceeding{" "}
              <span className="font-bold text-red-600">256 KB</span>. If any
              document fails the verification process, participants will be
              notified and given an opportunity to reupload the corrected file.
              Failure to meet the specified format, size, or authenticity
              requirements after re-uploading may result in disqualification.
              Ensure all submissions are clear, legible, and comply with the
              guidelines provided.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {REQUIRED_DOCUMENTS.map((doc) => {
                const isUploaded = !!documentUrls[doc.id];
                const documentErrors = errors.documents as
                  | Record<string, { message?: string } | undefined>
                  | undefined;
                const errorMessage = documentErrors?.[doc.id]?.message;
                return (
                  <div
                    key={doc.id}
                    className={`space-y-1.5 border rounded-[var(--radius)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 p-2 ${
                      isUploaded
                        ? "border-green-500 border-2"
                        : "border-gray-300"
                    }`}
                  >
                    <Label htmlFor={doc.id}>
                      {doc.label}{" "}
                      <span className="text-red-600 text-xs font-bold">
                        * (PNG / JPG)
                      </span>
                    </Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      {doc.hint}
                    </p>
                    {isUploaded ? (
                      <div className="w-full h-[244px] flex flex-col rounded-[var(--radius)] items-center justify-end p-12 space-y-2 bg-gradient-to-t from-green-50 to-transparent">
                        <div className="text-green-500 flex flex-col justify-items-center items-center gap-2 pb-10">
                          <p className="flex gap-2 items-center flex-row">
                            Upload Complete <VerifiedIcon />
                          </p>
                          <Image
                            src={`https://${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}.ufs.sh/f/${documentUrls[doc.id]}`}
                            width={60}
                            height={60}
                            alt="uploaded image"
                          />
                        </div>
                        <LoadingButton
                          type="button"
                          onClick={async () => {
                            await handleDeleteFromUploadThing(doc.id);
                          }}
                        >
                          Edit (Re-upload)
                        </LoadingButton>
                      </div>
                    ) : (
                      <UploadDropzone
                        endpoint="imageUploader"
                        onClientUploadComplete={(res) => {
                          if (res && res[0]) {
                            setDocumentUrls((prev) => ({
                              ...prev,
                              [doc.id]: res[0].key,
                            }));
                            toast.success(`${doc.label} Upload Completed`);
                          }
                        }}
                        onUploadError={(error: Error) => {
                          toast.error(
                            `Error: ${error.message} Uploading ${doc.label}`,
                          );
                        }}
                      />
                    )}
                    {errorMessage && (
                      <p className="text-red-500 text-sm">{errorMessage}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center gap-5">
          <Button className="px-8 text-xl" type="submit" disabled={disabled}>
            <Save className="w-5 h-5 mr-2" /> Save
          </Button>

          <Link href="/register/getallregister">
            <Button
              variant="outline"
              className="border hover:border-primary px-8 text-xl"
            >
              <ArrowLeft className="w-5 h-5 mr-2" /> Back
            </Button>
          </Link>
        </CardFooter>
      </form>
    </Card>
  );
}
