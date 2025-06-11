# Paysol

- i wann'a create a site which stores user contact's like what'sapp and publickey of them , so that
- we can pay them via their name remembering not their publicKey
- add scanner for payment also , which directs to user payment , only we need to add the amount in it ,
- add group payment's also means , i can pay more than one people at a time with ease
- implmenting priority fee model which will confirm the transaction at any status by taking some charges

## STEPS

- First step is to make transaction enable
- Now next step is to Make a database ans store user transaction detail , and allow to transact user via Name's

  Day 1

  - for this firstly i have created design of database :
  - add login functionality also
  - now , I will design the api's such as :

    - creating a New user, -done
    - creating a contact, -done
    - sending transaction, -done
    - indexing all contacts, -done

    Day 2

  - Now i will make contact page more interactive ,some implementations :
    - when we click contact on a icon , automatically a pay button creates for that contact -done
    - and after that make recent transaction tracking page for user -done
      - ideally we need to store all transaction in the database , and we will store transaction in database , but i will index the blockchain and from there i will grab the recent transaction of user public key for learning purpose , and also after every transaction success i need to store it in the database - done
      - Need all transacation when succedd to store in database also
    - add framer and making it more optimize - done
    - also a option for requesting payment to user -done
      - there will 2 page required for creating a new Payment request and Pending Payment request , we have to provide description
      - along while creating a payment request and after payment is succedd we have to show toaster message along with that fix ui header part which will give use , and store all request and their status in database,- done
      - error in all contact section it showing contact to evryone , making logic correct - done
    - also add search option in contact for searching on the base of username - done
    - a toaster message should pop out for payment status - done
    - add case like not more payment request than 10 in a day , and like a cross button for payment request cancellation also user must know about it , making more things in user payment request by showing toaster on everything

  Day -03

  - Multi Payment System When Amount is Fixed by having check button in contact page
  - Making Wallet Multibutton design Good
  - Making UI more Annimation and Premium
  - How can i add Confirm Payment Option in it ? also think means taking some Extra charge and confirming the Payment
  - Make User a Great Experience on Succesfull Payment

  Future Plans :
  A group Payment Mechanism

  - where user can add people and form group , a common account will be created to the group and
  - then can deposit fund their and after that suppose anybody can purchase from that group account by multisignature of the users in the group
  - Make it Fully Animated and Responsive - at last

### Questions :

    - how can i add solana tokens in user wallet by taking payments from them , like an exchange for usd ?

-
