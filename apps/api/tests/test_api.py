from datetime import timedelta

import pytest
from django.core.management import call_command
from django.utils import timezone

from core.models import Announcement, Tariff, Ticket, User


@pytest.fixture
def operator(db):
    u = User.objects.create(email='operator@test.local', role='operator', name='Op')
    u.set_password('Operator123!')
    u.save()
    return u


@pytest.fixture
def tech(db):
    u = User.objects.create(email='tech@test.local', role='tech', name='Tech')
    u.set_password('Tech123!')
    u.save()
    return u


@pytest.fixture
def user(db):
    u = User.objects.create(email='user@test.local', role='user', name='User')
    u.set_password('User123!')
    u.save()
    return u


def auth(client, email, password):
    response = client.post('/crm/api/auth/login', {'email': email, 'password': password}, content_type='application/json')
    return response.json()['access']


def test_login_after_seed(client, db):
    call_command('seed')
    response = client.post('/crm/api/auth/login', {'email': 'operator@has.local', 'password': 'Operator123!'}, content_type='application/json')
    assert response.status_code == 200
    assert 'access' in response.json()


def test_create_ticket(client, user):
    token = auth(client, user.email, 'User123!')
    response = client.post('/crm/api/tickets', {
        'type': 'support', 'address': 'Addr', 'contactName': 'A', 'phone': '+1', 'description': 'desc'
    }, content_type='application/json', HTTP_AUTHORIZATION=f'Bearer {token}')
    assert response.status_code == 201


def test_public_ticket_endpoint(client, db):
    response = client.post('/crm/api/public/tickets', {
        'address': 'Public', 'contactName': 'Anon', 'phone': '+777', 'description': 'Need internet'
    }, content_type='application/json')
    assert response.status_code == 201


def test_rbac_ticket_visibility(client, tech, user):
    ticket = Ticket.objects.create(type='support', address='A', contactName='C', phone='1', description='d', createdBy=user, assignedTo=tech)
    token = auth(client, tech.email, 'Tech123!')
    response = client.get('/crm/api/tickets', HTTP_AUTHORIZATION=f'Bearer {token}')
    assert response.status_code == 200
    assert len(response.json()) == 1 and response.json()[0]['id'] == ticket.id


def test_assign_tech_and_status_change(client, operator, tech, user):
    ticket = Ticket.objects.create(type='connect', address='a', contactName='b', phone='c', description='d', createdBy=user)
    token = auth(client, operator.email, 'Operator123!')
    response = client.patch(
        f'/crm/api/tickets/{ticket.id}',
        {'assignedTo': tech.id, 'status': 'in_progress'},
        content_type='application/json',
        HTTP_AUTHORIZATION=f'Bearer {token}',
    )
    assert response.status_code == 200
    assert response.json()['assignedTo'] == tech.id


def test_public_lists(client, db):
    Tariff.objects.create(title='T1', speedMbps=100, price=500, type='home', features=['x'])
    Announcement.objects.create(
        title='A1',
        body='b',
        level='info',
        startsAt=timezone.now() - timedelta(hours=1),
        endsAt=timezone.now() + timedelta(hours=1),
        placement='homepage',
    )
    assert client.get('/crm/api/public/tariffs').status_code == 200
    assert client.get('/crm/api/public/announcements').status_code == 200
