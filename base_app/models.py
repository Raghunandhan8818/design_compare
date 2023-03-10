from django.db import models


# Create your models here.
class Category(models.Model):
    name = models.CharField(max_length=40)


class SubCategory(models.Model):
    name = models.CharField(max_length=40)
    category = models.ForeignKey(Category, null=True, blank=True, related_name="related_subcategories",
                                 on_delete=models.SET_NULL)


class ImageData(models.Model):
    image = models.ImageField()
    uid = models.CharField(max_length=300, null=True, blank=True)
    sub_category = models.ForeignKey(SubCategory, null=True, blank=True, related_name="related_images",
                                     on_delete=models.SET_NULL)


class CustomerImage(models.Model):
    image = models.ImageField()
