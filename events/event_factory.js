const constants = require('./event_system_constants');

function wrapper(event_type)
{
    return {
        event_id: constants.microservice_prefix + Date.now(),
        event_type: event_type,
        event_origin: constants.microservice_name,
        event_time: new Date().toISOString(),
        content: {}
    };
}

function wrapperWithContent(event_type, content)
{
    var event = wrapper(event_type);
    event.content = content;
    return event;
}

function adminMessageBroadcastEvent(msg)
{
    return wrapperWithContent("admin_message_broadcast",
    {
        message: msg
    });
}

function accountCreatedEvent(account)
{
    return wrapperWithContent("account_created",
    {
        account_id: account.account_id,
        email: account.email,
        first_name: account.first_name,
        last_name: account.last_name,
        date_of_birth: account.date_of_birth,
        street: account.street,
        street2: account.street2,
        house_number: account.house_number,
        registration_date: account.registration_date
    });
}

module.exports.adminMessageBroadcastEvent = adminMessageBroadcastEvent;
module.exports.accountCreatedEvent = accountCreatedEvent;
