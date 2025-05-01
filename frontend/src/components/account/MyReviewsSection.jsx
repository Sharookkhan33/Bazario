import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Typography,
  Button,
  Textarea,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Rating,
  IconButton,
} from "@material-tailwind/react";
import api from "../../api/axios";

export default function MyReviewsSection() {
  const [reviews, setReviews] = useState([]);
  const [editReview, setEditReview] = useState(null);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ rating: 0, comment: "" });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await api.get("/review/my", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setReviews(res.data);
    } catch (err) {
      console.error("Failed to fetch reviews", err);
    }
  };

  const handleOpen = (review) => {
    setEditReview(review);
    setFormData({ rating: review.rating, comment: review.comment });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditReview(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, comment: e.target.value });
  };

  const handleRatingChange = (val) => {
    setFormData({ ...formData, rating: val });
  };

  const handleSubmit = async () => {
    try {
      await api.put(`/review/edit/${editReview._id}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setOpen(false);
      fetchReviews();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/review/delete/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchReviews();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <Typography variant="h4" className="mb-6 text-center">
        My Reviews & Ratings
      </Typography>

      {reviews.length === 0 ? (
        <Typography color="gray" className="text-center">No reviews yet.</Typography>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
          {reviews.map((r) => (
            <Card key={r._id} className="shadow-lg border">
              <CardBody>
                <Typography variant="h6" color="blue-gray">
                  {r.product.name}
                </Typography>
                <div className="flex items-center gap-2 mb-2">
                  <Rating value={r.rating} readonly />
                  <Typography>{r.rating}/5</Typography>
                </div>
                <Typography className="mb-4">{r.comment}</Typography>
                <div className="flex gap-2">
                  <Button size="sm" color="blue" onClick={() => handleOpen(r)}>
                    Edit
                  </Button>
                  <Button
  size="sm"
  className="bg-black/60 text-white hover:bg-gray-800"
  onClick={() => handleDelete(r._id)}
>
  Delete
</Button>

                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {open && (
  <div className="fixed inset-0 bg-black/50 z-[9998] p-4 max-w-6xl mx-auto"></div>
)}
{open && (
  <div className="fixed inset-0 bg-black/50 z-[9998] ">
    <Dialog
  open={open}
  handler={handleClose}
  size="xs"
  className="z-[9999] fixed inset-0 flex items-center justify-center p-4"
>
  <div className="bg-white rounded-lg w-full max-w-sm mx-auto">
    <DialogHeader className="border-b">Edit Your Review</DialogHeader>
    <DialogBody className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Typography className="text-sm">Rating:</Typography>
        <Rating
          value={formData.rating}
          onChange={(val) => handleRatingChange(val)}
        />
      </div>
      <Textarea
        label="Comment"
        value={formData.comment}
        onChange={handleChange}
      />
    </DialogBody>
    <DialogFooter className="flex justify-between border-t">
      <Button variant="text" onClick={handleClose}>
        Cancel
      </Button>
      <Button color="blue" onClick={handleSubmit}>
        Save
      </Button>
    </DialogFooter>
  </div>
</Dialog>
  </div>
)}



    </div>
  );
}
