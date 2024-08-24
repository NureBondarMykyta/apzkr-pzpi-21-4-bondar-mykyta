# serializers.py

from rest_framework import serializers
from .models import Location, Parameter, MonitoringData, LocationType, Notification


class ParameterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Parameter
        fields = ['parameter_name', 'unit', 'weight', 'max_value']


class MonitoringDataSerializer(serializers.ModelSerializer):
    parameter = ParameterSerializer()
    class Meta:
        model = MonitoringData
        fields = ['parameter', 'value', 'update_time']


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ['id', 'name', 'description', 'country', 'city', 'location_type']



class LocationTypesSerializer(serializers.ModelSerializer):
    class Meta:
        model = LocationType
        fields = ['id', 'name']



class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = "__all__"




